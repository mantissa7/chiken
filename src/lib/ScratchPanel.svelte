<script lang="ts">
    import Panel from "./Panel.svelte";
    import { appState } from "./state.svelte";
    import { store } from "./store";
    import Leaf from "./tree/Leaf.svelte";
    import Tree from "./tree/Tree.svelte";

    const setActive = (path: string) => {
        appState.activeScratch = path;
    };

    const handleNewScratch = async (e: MouseEvent) => {
        e.preventDefault();
        const newName = `scratch ${appState.scratch.length + 1}`;
        await store.persistScratch(newName, "");
        appState.activeScratch = newName;
    };
</script>

<Panel id="panel-right" title="Scratch Pad">
    <Tree>
        {#each appState.scratch as file}
            <Leaf onSelect={() => setActive(file)} active={appState.activeScratch === file}>
                {file}
            </Leaf>
        {/each}
    </Tree>
    <button onclick={handleNewScratch}>New Scratch</button>
</Panel>

<style>
</style>
