import m from "mithril";
import { invoke } from "@tauri-apps/api";
import { log } from "./error.js";

export const model = {
    port: "",
    async init() {
        try {
            this.port = await invoke("get_port");
            m.redraw();
        } catch (err) {
            log(err);
        }
    },
    connect(ip) {
        console.log(ip);
    },
};

export default model;
