<script lang="ts">
    import { appState } from "./state.svelte";
    import Tree from "./Tree.svelte";
</script>

<div>
    <div class="title">Files</div>
    <Tree data={appState.files} />
</div>

<style>
    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
        margin-bottom: 3px;
    }
</style>
