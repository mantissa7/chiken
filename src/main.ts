import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";
import { store } from "./lib/store";
import { appState } from "./lib/state.svelte";

const init = async () => {
	store.init();
	const files = await store.fileMeta();
	console.log(files);
	
	appState.files = files.tables;
	appState.scratch = files.scratch;
};

init();


const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;
