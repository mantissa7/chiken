<script lang="ts">
    import { appState } from "./state.svelte";
    import Tree from "./Tree.svelte";

    let active = $state<string | null>(null);

    const setActive = (path: string) => {
        active = path;
    };
</script>

<div>
    <div class="title">Scratch Pad {active}</div>
    <Tree data={appState.scratch} onSetActive={setActive} {active} />
    <div style="text-align: center; width: 100%;">+</div>
</div>

<style>
    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
    }
</style>
