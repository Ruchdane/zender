import m from "mithril";
import { routes } from "../routes";


const Material = {
	oninit(vnode) {
		routes.settile();
	},
	view(vnode) {
		return (
			<div class="app">
				<p>Material design showcase</p>
			</div>
		);
	},
};
export default Material;
