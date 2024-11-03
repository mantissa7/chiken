<script lang="ts">
	import DropZone from "./DropZone.svelte";
	import { appState } from "./state.svelte";
</script>

<div id="vis">
	<table>
		<thead>
			<tr>
				{#each appState.currentTable[0] as col}
					<th>{col}</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each appState.currentTable.slice(1) as row}
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
		overflow: auto;
	}
</style>
