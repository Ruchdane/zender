import m from "mithril";

import "./sidebar.scss";

const Item = {
    view(vnode) {
        return m(
            "li.item" +
                (m.route.get().startsWith(vnode.attrs.url) ? ".active" : ""),
            m(
                m.route.Link,
                {
                    selector: "div",
                    href: vnode.attrs.url,
                },
                m("i.bi[aria-hidden='true']", {
                    class: "bi-" + vnode.attrs.icon,
                })
            )
        );
    },
};
export default Item;
