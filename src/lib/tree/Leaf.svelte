<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import type { HTMLBaseAttributes } from "svelte/elements";

    type LeafProps = {
        active?: boolean;
        icon?: Snippet;
        onSelect?: () => void;
        onDelete?: () => void;
    };

    let { active, onSelect, onDelete, children }: HTMLBaseAttributes & LeafProps = $props();

    const handleInput = (e: KeyboardEvent) => {
        if (e.metaKey && e.key === 'Backspace') {
            console.log('cmd bac');
            onDelete?.();   
        }
    }

    // let el: HTMLElement;
    // onMount(() => {

    // })
</script>

<div class="leaf" class:active role="listitem" onkeydown={handleInput} tabindex="-1">
    <button onclick={() => onSelect?.()}>
        {@render children?.()}
    </button>
</div>

<style>
.leaf {
        cursor: pointer;
        padding: 0 10px;
        user-select: none;
        display: grid;
        align-items: center;

        &:focus {
            border: 1px solid #fff;
        }

        &:hover {
            background-color: #242424;
        }

        &.active {
            background-color: #242424;
        }

        & button {
            all: unset;
        }
    }
</style>
