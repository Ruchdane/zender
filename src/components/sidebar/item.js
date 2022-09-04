import { Icon, Tooltip } from "construct-ui";
import m from "mithril";

import "./sidebar.scss";

const Item = {
	view(vnode) {
		return m(Tooltip, {
			content: vnode.attrs.title,
			position: "right",
			trigger: m(
				"li.item" +
					(m.route.get().startsWith(vnode.attrs.url) ? ".active" : ""),
				m(
					m.route.Link,
					{
						selector: "a",
						href: vnode.attrs.url,
					},
					m(Icon, {
						class: "icon",
						name: vnode.attrs.icon,
					})
				)
			),
		});
	},
};
export default Item;
