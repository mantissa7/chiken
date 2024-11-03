import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";
import { store } from "./lib/store";
import { appState } from "./lib/state.svelte";
import { sleep } from "./lib/util";

const init = async () => {
	// observe files using polling
	// implement FileSystemObserver when it lands in Baseline
	
	while (true) {
		
		const files = await store.fileMeta();
		
		appState.files = files.tables;
		appState.scratch = files.scratch;
	
		await sleep(1000);
	}
};

init();

const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;
