import "./app.css";
import App from "./App.svelte";
import { mount } from "svelte";
import { store } from "./lib/store";

store.init();

const app = mount(App, {
	target: document.getElementById("app")!,
});

export default app;
