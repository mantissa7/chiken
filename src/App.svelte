<script lang="ts">
	import Editor from "./lib/Editor.svelte";
	import FilePanel from "./lib/FilePanel.svelte";
	import Vis from "./lib/Vis.svelte";
</script>

<header><h1>知見 Chiken</h1></header>

<aside id="panel-left" class="panel">
	<FilePanel />
</aside>
<Editor />
<Vis />
<aside id="panel-right" class="panel"></aside>

<footer></footer>

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
