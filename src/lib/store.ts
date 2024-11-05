import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";

const MANUAL_BUNDLES: duckdb.DuckDBBundles = {
	mvp: {
		mainModule: duckdb_wasm,
		mainWorker: mvp_worker,
	},
	eh: {
		mainModule: duckdb_wasm_eh,
		mainWorker: eh_worker,
	},
};

enum DIR {
	SCRATCH = "scratch",
	TABLES = "tables",
}

export class Store {
	private db: duckdb.AsyncDuckDB;
	private conn: duckdb.AsyncDuckDBConnection;

	constructor(db: duckdb.AsyncDuckDB, conn: duckdb.AsyncDuckDBConnection) {
		this.db = db;
		this.conn = conn;
	}

	public static async init() {
		const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
		const worker = new Worker(bundle.mainWorker!);
		const logger = new duckdb.ConsoleLogger();
		const db = new duckdb.AsyncDuckDB(logger, worker);

		await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

		const opfsRoot = await navigator.storage.getDirectory();
		// const fileHandle = await opfsRoot.getFileHandle("chiken.db", {
		// 	create: false,
		// });
		// await db.registerFileHandle('chiken.db', fileHandle, 4, true);

		// await this.conn.query(`ATTACH DATABASE 'chiken.db'`)

		// make default scratch file
		const folderHandle = await opfsRoot.getDirectoryHandle(DIR.SCRATCH, {
			create: true,
		});

		await folderHandle.getFileHandle("default", {
			create: true,
		});

		const store = new Store(db, await db.connect());
		await store.registerTables();
		console.log("DuckDB Ready");
		return store;
	}

	public async registerTable(name: string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle(DIR.TABLES);

		const fileHandle = await tables.getFileHandle(name);
		const file = await fileHandle.getFile();

		await this.db.registerFileHandle(name, file, duckdb.DuckDBDataProtocol.BROWSER_FILEREADER, true);
		// await this.db.registerFileHandle(name, fileHandle, duckdb.DuckDBDataProtocol.BROWSER_FSACCESS, true);
	}

	public async deleteTable(name: string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle(DIR.TABLES);
		tables.removeEntry(name);
	}

	private async registerTables() {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle(DIR.TABLES, { create: true });

		for await (const k of tables.keys()) {
			this.registerTable(k);
		}
	}

	public async fileMeta() {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle(DIR.TABLES, {
			create: true,
		});
		const scratch = await opfsRoot.getDirectoryHandle(DIR.SCRATCH, {
			create: true,
		});

		const tableNames = [];
		for await (const x of tables.keys()) {
			tableNames.push(x);
		}

		const scratchNames = [];
		for await (const x of scratch.keys()) {
			scratchNames.push(x);
		}

		return {
			tables: tableNames,
			scratch: scratchNames,
		};
	}

	public async saveFile(filename: string, dir: string, contents: File | string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const directoryHandle = await opfsRoot.getDirectoryHandle(dir, {
			create: true,
		});

		const fileHandle = await directoryHandle.getFileHandle(filename, {
			create: true,
		});

		const w = await fileHandle.createWritable();

		await w.write(contents);
		await w.close();
	}

	private async readFile(filename: string, dir: string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const directoryHandle = await opfsRoot.getDirectoryHandle(dir, {
			create: false,
		});

		const fileHandle = await directoryHandle.getFileHandle(filename, {
			create: false,
		});
		const f = await fileHandle.getFile();

		return await f.text();
	}

	public async readScratch(filename: string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const directoryHandle = await opfsRoot.getDirectoryHandle(DIR.SCRATCH);

		const fileHandle = await directoryHandle.getFileHandle(filename);
		const f = await fileHandle.getFile();

		return await f.text();
	}

	public async importFile(file: File) {
		await this.saveFile(file.name, DIR.TABLES, file);
		await this.registerTable(file.name);
	}

	// Save file and register external file in DuckDB
	public async import(filename: string, contents: string) {
		await this.saveFile(filename, DIR.TABLES, contents);
		await this.registerTable(filename);

		// await this.db.registerFileText(filename, contents);
		// await this.conn.insertCSVFromPath(filename, { name: filename });
		// this.persistTable(filename);
	}

	public async persistScratch(filename: string, contents: string) {
		await this.saveFile(filename, DIR.SCRATCH, contents);
	}

	public async query(qry: string) {
		try {
			// console.log("tablers", await this.parseTablesFromSQL(qry));

			return await this.conn.query(qry);
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				if (error.message.startsWith("IO Error: No files found that match the pattern")) {
					// NO FILE ERROR
					// this.readFile()
					// this.import()
				}
			}
			throw new Error("Query Failed");
		}
	}

	// Tokenise SQL and return table names
	private async parseTablesFromSQL(sql: string): Promise<Set<string>> {
		const tokens = await this.db.tokenize(sql);

		const tbls = tokens.offsets.map((pos, idx) => {
			if (tokens.types[idx] !== 0) {
				return "";
			}
			const endPos = idx === tokens.offsets.length - 1 ? -1 : tokens.offsets[idx + 1];

			return sql.slice(pos, endPos).trim().replaceAll('"', "");
		});

		const s = new Set(tbls);
		s.delete("");

		return s;
	}

	// Read table schema
	public async schema(table: string) {
		const q = await this.conn.query(`
			select	  table_name,
					      json_group_object(column_name, data_type) as schema
			from	    information_schema.columns
			group by 	table_name
		`);

		return q.toArray().map((row) => row.toJSON());
	}
}

export const store = await Store.init();
