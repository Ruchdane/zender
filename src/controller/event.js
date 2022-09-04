// import { listen, emit } from "@tauri-apps/api/event";
import { invoke } from "@tauri-apps/api";

/* async */ function setup() {
	if (window.__TAURI_IPC__)
		document.addEventListener("DOMContentLoaded", () => {
			// This will wait for the window to load, but you could
			// run this function on whatever trigger you want
			invoke("close_splashscreen");
		});
}
export { setup };
