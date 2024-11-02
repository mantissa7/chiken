<script context="module" lang="ts">
    // export type Branch = {
    //     name: string;
    //     path: string;
    //     type: string;
    //     children?: Branch[];
    // };
</script>

<script lang="ts">
    export let data: string[];
    export let active: string | null = null;
    export let onSetActive: (path: string) => void = () => {};
</script>

<ul class="tree">
    {#each data as leaf}
        <li class:active={active === leaf}>
            <button onclick={() => onSetActive(leaf)}>
                {leaf}
            </button>
        </li>
        <!-- {#if branch.children?.length}
            <svelte:self data={branch.children} />
        {/if} -->
    {/each}
</ul>

<style>
    .tree {
        list-style: none;
        margin: 0;
        padding: 2px 0;

        li {
            cursor: pointer;
            padding: 0 10px;
            height: 20px;
            user-select: none;
            display: grid;
            align-items: center;

            &:hover {
                background-color: #242424;
            }

            &.active {
                background-color: #242424;
            }
        }
    }
</style>
