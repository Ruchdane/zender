import m from 'mithril';
import { invoke } from "@tauri-apps/api";

export const model = {
	user: undefined,
	peers: [],
    init() {
		invoke("get_local_user")
            .then(user => {
                model.user = user
                m.redraw();
            }
        );
		invoke("get_peers")
            .then(peers => {
                model.peers = peers
                m.redraw();
            }
        );
	}
};

export default model;
