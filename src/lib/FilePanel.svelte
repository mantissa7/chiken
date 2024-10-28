<script lang="ts">
    import { app } from "./state.svelte";
</script>

<div>
    <div class="title">Files</div>
    <ul>
        {#each app.files as file}
            <li>{file.name}</li>
        {/each}
    </ul>
</div>

<style>
    .title {
        padding: 0 10px;
        border-bottom: 1px solid #fff2;
        font-weight: bold;
    }

    ul {
        margin: 0;
        padding: 2px 0;
    }

    li {
        padding: 0 10px;
    }
</style>
