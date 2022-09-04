import { Icons } from "construct-ui";
import m from "mithril";
import Item from "./item";

import "./sidebar.scss";

const Sidebar = {
	view(vnode) {
		return (
			<aside class="sidebar">
				<ul class="top-items">
					<Item icon={Icons.HOME} url="/home" title="Home" />
					<Item icon={Icons.USERS} active url="/users" title="Users" />
					<Item icon={Icons.DOWNLOAD} url="/download" title="Downloads" />
					<Item icon={Icons.UPLOAD} url="/shared" title="Shared" />
				</ul>
				<ul class="bottom-items">
					<Item icon={Icons.SETTINGS} url="/settings" title="Settings" />
				</ul>
			</aside>
		);
	},
};
export default Sidebar;
