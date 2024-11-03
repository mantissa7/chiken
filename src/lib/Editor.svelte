<script lang="ts">
  import { basicSetup } from "codemirror";
  import { EditorState } from "@codemirror/state";
  import { EditorView, keymap } from "@codemirror/view";
  import { insertTab, indentLess } from "@codemirror/commands";
  import { oneDark } from "@codemirror/theme-one-dark";
  import { sql } from "@codemirror/lang-sql";
  import { onMount } from "svelte";
  import { store } from "./store";
  import { appState } from "./state.svelte";
  // import { get, set } from "idb-keyval";

  const makeEditorState = async (filename: string) => {
    return EditorState.create({
      doc: await store.readScratch(filename),
      extensions: [
        EditorView.updateListener.of((v) => {
          if (v.docChanged) {
            // onUpdate(v.state.doc.toString());
            store.persistScratch(filename, v.state.doc.toString());
            // set("scratch", v.state.doc.toString());
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
    });
  };

  let editorDiv: HTMLDivElement;
  let editor: EditorView;

  const runQuery = (target: EditorView) => {
    const qry = target.state.doc.toString();
    store.query(qry).then((tbl) => {
      const result = tbl.toArray().map((row) => row.toArray());

      appState.currentTable = [tbl.schema.names, ...result];
    });

    return true;
  };

  onMount(async () => {
    editor = new EditorView({
      state: await makeEditorState("default"),
      parent: editorDiv,
    });
  });

  $effect(() => {
    makeEditorState(appState.activeScratch).then(state => {
      editor.setState(state);
    })
  });
</script>

<div id="editor" bind:this={editorDiv}></div>

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
