<script lang="ts">
	import DropZone from "./lib/DropZone.svelte";
	import Editor from "./lib/Editor.svelte";
	import FilePanel from "./lib/FilePanel.svelte";
	import ScratchPanel from "./lib/ScratchPanel.svelte";
	import Vis from "./lib/Vis.svelte";
</script>

<DropZone>
	<header><h1>知見 Chiken</h1></header>

	<aside id="panel-left" class="panel">
		<FilePanel />
	</aside>
	<Editor />
	<Vis />
	<aside id="panel-right" class="panel">
		<ScratchPanel />
	</aside>

	<footer></footer>
</DropZone>

<style>
	header {
		grid-area: header;
		background: rgb(23, 23, 23);
	}

	.panel {
		width: 300px;
	}

	#panel-left {
		grid-area: panel-left;
	}

	#panel-right {
		grid-area: panel-right;
	}

	footer {
		grid-area: footer;
	}
</style>
