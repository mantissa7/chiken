<script lang="ts">
    import DropZone from "./lib/DropZone.svelte";
    import Editor from "./lib/Editor.svelte";
    import FilePanel from "./lib/FilePanel.svelte";
    import ScratchPanel from "./lib/ScratchPanel.svelte";
    import Vis from "./lib/Vis.svelte";
</script>

<DropZone>
    <header><h1>知見 Chiken</h1></header>

    <FilePanel/>
    <Editor />
    <Vis />
    <ScratchPanel />

    <footer></footer>
</DropZone>

<style>

</style>
