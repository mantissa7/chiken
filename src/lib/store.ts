import type { ChikenFile } from "./state.svelte";

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

export class Store {
	private db: duckdb.AsyncDuckDB;
	private conn: duckdb.AsyncDuckDBConnection;

	public async init() {
		// Select a bundle based on browser checks
		const bundle = await duckdb.selectBundle(MANUAL_BUNDLES);
		const worker = new Worker(bundle.mainWorker!);
		const logger = new duckdb.ConsoleLogger();
		const db = new duckdb.AsyncDuckDB(logger, worker);
		await db.instantiate(bundle.mainModule, bundle.pthreadWorker);
		this.db = db;
		this.conn = await db.connect();

		console.log("DuckDB Ready");

		// return db;
	}

	// public async saveFile(file: ChikenFile) {
	//     const opfsRoot = await navigator.storage.getDirectory();
	// 	const fileHandle = await opfsRoot.getFileHandle("fast", { create: true });
	// 	const accessHandle = await fileHandle.createSyncAccessHandle();

	// 	const textEncoder = new TextEncoder();
	// 	const textDecoder = new TextDecoder();

	// 	// Initialize this variable for the size of the file.
	// 	let size;
	// 	// The current size of the file, initially `0`.
	// 	size = accessHandle.getSize();
	// 	// Encode content to write to the file.
	// 	const content = textEncoder.encode("Some text");
	// 	// Write the content at the beginning of the file.
	// 	accessHandle.write(content, { at: size });
	// 	// Flush the changes.
	// 	accessHandle.flush();
	// 	// The current size of the file, now `9` (the length of "Some text").
	// 	size = accessHandle.getSize();

	// 	// Encode more content to write to the file.
	// 	const moreContent = textEncoder.encode("More content");
	// 	// Write the content at the end of the file.
	// 	accessHandle.write(moreContent, { at: size });
	// 	// Flush the changes.
	// 	accessHandle.flush();
	// 	// The current size of the file, now `21` (the length of
	// 	// "Some textMore content").
	// 	size = accessHandle.getSize();

	// 	// Prepare a data view of the length of the file.
	// 	const dataView = new DataView(new ArrayBuffer(size));

	// 	// Read the entire file into the data view.
	// 	accessHandle.read(dataView, { at: 0 });
	// 	// Logs `"Some textMore content"`.
	// 	console.log(textDecoder.decode(dataView));

	// 	// Read starting at offset 9 into the data view.
	// 	accessHandle.read(dataView, { at: 9 });
	// 	// Logs `"More content"`.
	// 	console.log(textDecoder.decode(dataView));

	// 	// Truncate the file after 4 bytes.
	// 	accessHandle.truncate(4);
	// }

	public async import(file: ChikenFile) {
		await this.db.registerFileText(file.name, file.text);
		await this.conn.insertCSVFromPath(file.name, { name: file.name });
		// await this.conn.insertCSVFromPath(file.name, {
		// 	schema: 'main',
		// 	name: 'foo',
		// 	detect: false,
		// 	header: false,
		// 	delimiter: '|',
		// 	columns: {
		// 		col1: new arrow.Int32(),
		// 		col2: new arrow.Utf8(),
		// 	},
		// });
	}

	public async query(qry: string) {
		return await this.conn.query(qry);
	}
}

export const store = new Store();
