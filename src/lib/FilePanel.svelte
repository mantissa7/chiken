<script lang="ts">
    import Panel from "./Panel.svelte";
    import { appState } from "./state.svelte";
    import { store } from "./store";
    import Leaf from "./tree/Leaf.svelte";
    import Tree from "./tree/Tree.svelte";

    let active = $state();

    const handleDelete = (file: string) => {
        console.log('delete');
        
        store.deleteTable(file);
    }
</script>

<Panel id="panel-left" title="Files">
    <Tree>
        {#each appState.files as file}
            <Leaf active={active === file} onSelect={() => active = file} onDelete={() => handleDelete(file)}>{file}</Leaf>
        {/each}
    </Tree>
</Panel>

<style>
</style>
