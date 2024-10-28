<script lang="ts">
	import Papa from "papaparse";
	import { app, type ChikenFile } from "./state.svelte";
	import { store } from "./store";

	let dragover = $state(false);

	const parseCSV = async (text: string) => {
		const parsed = Papa.parse(text, {});
		return parsed;
	};

	const handleFile = async (file: File) => {
		console.log(`file name = ${file.name}`);
		console.log(file.type);
		let tableData = [];

		switch (file.type) {
			case "text/csv": {
				const t = await file.text();
				const ret = await parseCSV(t);
				const f: ChikenFile = {
					name: file.name,
					type: file.type,
					data: ret.data,
					text: t,
				};
				app.files.push(f);
				store.import(f);

				tableData = ret.data;
				break;
			}
		}

		app.currentTable = tableData;
	};

	const handleDragEnter = (e) => {
		dragover = true;
	};

	const handleDrag = (e) => {
		e.preventDefault();
		// console.log(e.dataTransfer);
		dragover = true;
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		dragover = false;
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		dragover = false;

		if (e.dataTransfer?.items) {
			// Use DataTransferItemList interface to access the file(s)
			[...e.dataTransfer.items].forEach((item, i) => {
				// If dropped items aren't files, reject them
				if (item.kind === "file") {
					const file = item.getAsFile();
					if (!file) {
						console.warn(`No File Found for ${item.type}`);

						return;
					}
					handleFile(file);
				}
			});
		} else {
			// Use DataTransfer interface to access the file(s)
			[...(e.dataTransfer?.files ?? [])].forEach((file, i) => {
				handleFile(file);
			});
		}
	};
</script>

<div
	id="vis"
	ondragenter={handleDragEnter}
	ondragover={handleDrag}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<div class={`drag-guide ${dragover ? "show" : ""}`}>Drop CSV/XLS here</div>
	<table>
		<thead>
			<tr>
				{#each app.currentTable[0] as col}
					<th>{col}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each app.currentTable.slice(1) as row}
				<tr>
					{#each row as col}
						<td>{col}</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style>
	#vis {
		grid-area: vis;
		margin: 5px;
		padding: 16px;
		background-color: #242424;
		position: relative;

		& .drag-guide {
			opacity: 0;
			pointer-events: none;
			position: absolute;
			inset: 0;
			border: 2px dotted #fff;
			display: grid;
			place-items: center;

			&.show {
				opacity: 1;
			}
		}
	}
</style>
