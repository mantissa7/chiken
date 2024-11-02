<script lang="ts">
  import { basicSetup } from "codemirror";
  import { EditorView, keymap } from "@codemirror/view";
  import { insertTab, indentLess } from "@codemirror/commands";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { sql } from "@codemirror/lang-sql";
  import { onMount } from "svelte";
  import { store } from "./store";
  import { appState } from "./state.svelte";
  import { get, set } from "idb-keyval";

  let editor: HTMLDivElement;

  const runQuery = (target: EditorView) => {
    const qry = target.state.doc.toString();
    store.query(qry).then((tbl) => {
      
      const result = tbl.toArray().map((row) => row.toArray());

      appState.currentTable = [tbl.schema.names, ...result];
    });

    return true;
  };

  onMount(async () => {
    new EditorView({
      doc: await get("scratch"),
      extensions: [
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            set("scratch", v.state.doc.toString());
          }
        }),
        keymap.of([
          // indentWithTab,
          { key: "Tab", preventDefault: true, run: insertTab },
          { key: "Shift-Tab", preventDefault: true, run: indentLess },
          { key: "Ctrl-Enter", preventDefault: true, run: runQuery },
          { key: "Cmd-Enter", preventDefault: true, run: runQuery },
        ]),
        basicSetup,
        oneDark,
        sql(),
      ],
      parent: editor,
    });
  });
</script>

<div id="editor" bind:this={editor}></div>

<style>
  #editor {
    grid-area: editor;
    margin: 5px;
    background-color: #242424;
    overflow: auto;

    /* & .cm-editor {
      height: 100%;
    }

    & .cm-gutters {
      background-color: #242424;
    }

    & .cm-activeLine {
      background-color: #282828;
    }

    & .cm-cursor {
      border-left: 1.2px solid white;
    }

    & .cm-gutters {
      border-right: 1px solid #413f3f;
    }

    * .cm-selectionBackground {

    } */
  }
</style>
