import { Spinner } from "construct-ui";
import m from "mithril";

export const FilesGridView = {
    view(vnode) {
        const files = vnode.attrs.files;
        return files ?
            (files.length === 0 ? files.map((file, i) => {
                return m("div", {
                    selected: vnode.attrs.isSelected(i),
                    onclick() { vnode.attrs.select(i) },
                    ondbclick() { vnode.attrs.ondbclick(i) }
                }, file.path);
            }) :
                m("h2", "nothing")
            ) :
            m(Spinner);
    }
};
