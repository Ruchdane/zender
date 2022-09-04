import m from "mithril";
import { routes } from "../routes";

import Sidebar from "../components/sidebar/sidebar";

const SharedDetail = {
	oninit(vnode) {
		routes.settile();
	},
	view(vnode) {
		return (
			<>
				<Sidebar />
				<main>Shared detail</main>
			</>
		);
	},
};
export default SharedDetail;
