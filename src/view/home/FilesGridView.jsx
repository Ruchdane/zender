import m from "mithril";
import { filesModel as model } from "./home";



/**
 * Show a list of loading item 
 * 
 * Show a list of loaded item 
 * 
 * Allow you to select multiple item
 * 
 * Allow you to open an item
 * 
 * Allows you to highlight selected item
 */
export const FilesGridView = {
    view(vnode) {
        return <div>
            {model.metadatas.length !== 0
                ? model.metadatas.map((metadata, i) => {
                    return metadata !== undefined
                        ? m("div", {
                            selected: vnode.attrs.isSelected(i),
                            onclick() { vnode.attrs.select(i) },
                            ondbclick() { vnode.attrs.ondbclick(i) }
                        }, metadata.path)
                        : m(".skeleton", m(".icon.loading"), m("name.loading"));
                }) :
                // TODO Empty folder icon
                m("h2.empty", "Empty")}
        </div>
    }
}
    ;
