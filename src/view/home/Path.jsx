import m from "mithril";
import { Breadcrumb, BreadcrumbItem, Icon, Icons } from "construct-ui";
import { path } from "@tauri-apps/api";

/**
 * Mithril Component
 *
 * Show each element of a path
 *
 * Allow to go to any element of the path
 *
 *  @param {string} path - The path to show
 *  @param {(string) => {}} updatePath - The callback for when the path change
 */
export function Path() {
    return {
        view(vnode) {
            return m(
                Breadcrumb,
                {
                    class: "path",
                    seperator: m(Icon, {
                        class: "path-separator",
                        name: Icons.CHEVRON_RIGHT,
                    }),
                },
                vnode.attrs.path
                    .split(path.sep)
                    .filter((segment) => segment !== "")
                    .map((segment, index, array) =>
                        index + 1 !== array.length
                            ? m(
                                  BreadcrumbItem,
                                  {
                                      href: "#",
                                      class: "path-item",
                                      onclick: () => {
                                          let updatedPath = "/";
                                          for (let i = 0; i <= index; i++) {
                                              updatedPath +=
                                                  array[i] + path.sep;
                                          }
                                          vnode.attrs.updatePath(updatedPath);
                                      },
                                  },
                                  segment
                              )
                            : m(
                                  BreadcrumbItem,
                                  {
                                      class: "path-item",
                                  },
                                  segment
                              )
                    )
            );
        },
    };
}
