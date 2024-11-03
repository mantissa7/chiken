<script lang="ts">
    import { appState } from "./state.svelte";
    import { store } from "./store";
    import Tree from "./Tree.svelte";

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

<div>
    <div class="title">Scratch Pad</div>
    <Tree
        data={appState.scratch}
        onSetActive={setActive}
        active={appState.activeScratch}
    />
    <button onclick={handleNewScratch}>New Scratch</button>
</div>

<style>
    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
    }
</style>
