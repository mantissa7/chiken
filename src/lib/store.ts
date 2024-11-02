import * as duckdb from "@duckdb/duckdb-wasm";
import duckdb_wasm from "@duckdb/duckdb-wasm/dist/duckdb-mvp.wasm?url";
import mvp_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-mvp.worker.js?url";
import duckdb_wasm_eh from "@duckdb/duckdb-wasm/dist/duckdb-eh.wasm?url";
import eh_worker from "@duckdb/duckdb-wasm/dist/duckdb-browser-eh.worker.js?url";
// import { get, set } from "idb-keyval";

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

export class Store {
	private db: duckdb.AsyncDuckDB;
	private conn: duckdb.AsyncDuckDBConnection;

	public async init() {
		// Select a bundle based on browser checks
		const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
		console.log(bundle);

		const worker = new Worker(bundle.mainWorker!);
		const logger = new duckdb.ConsoleLogger();
		const db = new duckdb.AsyncDuckDB(logger, worker);

		await db.instantiate(bundle.mainModule, bundle.pthreadWorker);

		// const opfsRoot = await navigator.storage.getDirectory();
		// const fileHandle = await opfsRoot.getFileHandle('chiken.db', {
		// 	create: false,
		// });
		// await db.registerFileHandle('chiken.db', fileHandle, 4, true);
		this.db = db;
		this.conn = await db.connect();
		await this.registerTables();
		// await this.conn.query(`ATTACH DATABASE 'chiken.db'`)

		console.log("DuckDB Ready");

		// return db;
	}

	public async registerTable(name: string) {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle("tables", {
			create: false,
		});

		const fileHandle = await tables.getFileHandle(name, {
			create: false,
		});
		const file = await fileHandle.getFile();

		await this.db.registerFileHandle(
			name,
			file,
			duckdb.DuckDBDataProtocol.BROWSER_FILEREADER,
			true,
		);
		// await this.db.registerFileHandle(
		// 	name,
		// 	// file,
		// 	fileHandle,
		// 	duckdb.DuckDBDataProtocol.BROWSER_FSACCESS,
		// 	true,
		// );
	}

	public async registerTables() {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle("tables", {
			create: false,
		});

		for await (const k of tables.keys()) {
			this.registerTable(k);
		}
	}

	public async fileMeta() {
		const opfsRoot = await navigator.storage.getDirectory();
		const tables = await opfsRoot.getDirectoryHandle("tables", {
			create: true,
		});
		const scratch = await opfsRoot.getDirectoryHandle("scratch", {
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

	public async saveFile(filename: string, dir: string, contents: string) {
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

	public async import(filename: string, contents: string) {
		await this.saveFile(filename, "tables", contents);
		await this.registerTable(filename);

		// await this.db.registerFileText(filename, contents);
		// await this.conn.insertCSVFromPath(filename, { name: filename });
		// this.persistTable(filename);
	}

	public async persistScratch(filename: string, contents: string) {
		await this.saveFile(filename, "scratch", contents);
	}

	private async persistTable(table: string) {
		console.log(table);
		await this.conn.query(
			`COPY ${table} TO '${table}.parquet' (FORMAT PARQUET);`,
		);
		const buff = await this.db.copyFileToBuffer(`${table}.parquet`);
		await this.saveFile(table, "tables", buff.toString());
	}

	public async query(qry: string) {
		try {
			console.log('tablers', await this.parseTablesFromSQL(qry));
			
			return await this.conn.query(qry);
		} catch (error) {
			console.log(error);
			if (error instanceof Error) {
				if (
					error.message.startsWith(
						"IO Error: No files found that match the pattern",
					)
				) {
					// NO FILE ERROR
					// this.readFile()
					// this.import()
				}
			}
		}
	}

	private async parseTablesFromSQL(sql: string) {
		const tokens = await this.db.tokenize(sql);
		console.log(tokens);
		const tbls = tokens.offsets.map((pos, idx) => {
			if (tokens.types[idx] !== 0) {
				return "";
			}
			const endPos =
				idx === tokens.offsets.length - 1 ? -1 : tokens.offsets[idx + 1];

			return sql.slice(tokens.offsets[idx], endPos).trim().replaceAll('"', '');
		});

		return new Set(tbls).delete("");
	}

	public async schema(table: string) {
		const q = await this.conn.query(`
			select	 table_name,
					 json_group_object(column_name, data_type) as schema
			from	 information_schema.columns

			group by table_name
		`);

		return q.toArray().map((row) => row.toJSON());
	}
}

export const store = new Store();
