import m from "mithril";
import { Breadcrumb, BreadcrumbItem, Icon, Icons } from "construct-ui";
import { path } from "@tauri-apps/api";


export function Path() {
    return {
        view(vnode) {
            return m(Breadcrumb, {
                class: "path",
                seperator:
                    m(Icon, {
                        class: "path-separator",
                        name: Icons.CHEVRON_RIGHT
                    })
            },
                vnode.attrs.path.split(path.sep).map((segment, index, array) =>
                    index !== array.length - 1
                        ? m(BreadcrumbItem, {
                            href: "#",
                            class: "path-item",
                            onclick: () => {
                                let updatedPath = "";
                                for (let i = 0; i <= index; i++) {
                                    updatedPath += array[i] + path.sep;
                                }
                                vnode.attrs.updatePath(updatedPath);
                            }
                        }, segment)
                        : null)
            );
        }
    };
}
