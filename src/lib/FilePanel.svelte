<script lang="ts">
    import { appState } from "./state.svelte";
    import Tree from "./Tree.svelte";
</script>

<div>
    <div class="title">Files</div>
    <ul>
        <Tree data={appState.files} />
    </ul>
</div>

<style>
    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
    }
</style>
