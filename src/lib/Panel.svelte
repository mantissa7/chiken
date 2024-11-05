<script lang="ts">
    import type { HTMLBaseAttributes } from "svelte/elements";

    type Props = {
        title: string;
    }

    let {id, children, title}: HTMLBaseAttributes & Props = $props();
</script>

<div id={id} class="panel">
    <div class="title">{title}</div>
    {@render children?.()}
</div>

<style>
    .panel {
        display: grid;
        grid-template-rows: max-content 1fr;
    }

    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
        margin-bottom: 3px;
    }
</style>
