<script lang="ts">
    import type { ComponentProps } from "svelte";
    import { store } from "./store";

    let { children }: ComponentProps<any> = $props();
    let dragover = $state(false);

    const handleFile = async (file: File) => {
        console.log(`file name = ${file.name} [Type: ${file.type}]`);

        switch (file.type) {
            case "text/csv": {
                await store.importFile(file);

                // appState.currentTable = ret.data as unknown[][];
                break;
            }
            default: {
                if (file.name.endsWith(".parquet")) {
                    await store.importFile(file);
                }

                if (file.name.endsWith(".db")) {
                    // const opfsRoot = await navigator.storage.getDirectory();
                    // const fileHandle = await opfsRoot.getFileHandle(
                    // 	"chiken.db",
                    // 	{
                    // 		create: true,
                    // 	},
                    // );
                    // const w = await fileHandle.createWritable();
                    // await w.write(file);
                    // await w.close();
                }
            }
        }
    };

    const handleDragEnter = (e: DragEvent) => {
        dragover = true;
    };

    const handleDrag = (e: DragEvent) => {
        e.preventDefault();
        dragover = true;
    };

    const handleDragLeave = (e: DragEvent) => {
        e.preventDefault();
        dragover = false;
    };

    const handleDrop = (e: DragEvent) => {
        e.preventDefault();
        dragover = false;

        if (e.dataTransfer?.items) {
            // Use DataTransferItemList interface to access the file(s)
            [...e.dataTransfer.items].forEach((item, i) => {
                // If dropped items aren't files, reject them
                if (item.kind === "file") {
                    const file = item.getAsFile();
                    if (!file) {
                        console.warn(`No File Found for ${item.type}`);

                        return;
                    }
                    handleFile(file);
                }
            });
        } else {
            // Use DataTransfer interface to access the file(s)
            [...(e.dataTransfer?.files ?? [])].forEach((file, i) => {
                handleFile(file);
            });
        }
    };
</script>

<div
    class="dropzone"
    ondragenter={handleDragEnter}
    ondragover={handleDrag}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
    role="complementary"
>
    <div class={`drag-guide ${dragover ? "show" : ""}`}>Drop CSV/XLS here</div>
    {@render children?.()}
</div>

<style>
    .dropzone {
        display: contents;

        & .drag-guide {
            opacity: 0;
            pointer-events: none;
            position: absolute;
            inset: 0;
            border: 2px dotted #fff;
            display: grid;
            place-items: center;
            background: rgba(23, 23, 23, 0.7);
            z-index: 10;

            &.show {
                opacity: 1;
            }
        }
    }
</style>
