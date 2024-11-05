<script lang="ts">
    import type { HTMLBaseAttributes } from "svelte/elements"

    let { children }: HTMLBaseAttributes = $props();

    const handleClick = (e: MouseEvent) => {
        e.preventDefault();
        (e.target as HTMLDivElement)?.focus?.()
    }
</script>

<div class="tree" role="list" onclick={handleClick} tabindex="0">
    {@render children?.()}
</div>

<style>
    .tree {
        margin: 0;
        padding: 2px 0;
        border: 1px solid transparent;

        &:focus, &:focus-within {
            border: 1px solid #555555;
        }
    }
</style>
