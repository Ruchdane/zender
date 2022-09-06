import { Icon, Icons, Tooltip } from "construct-ui";
import m from "mithril";
import { match, unwrap } from "../../controller/pattern";

const MimeIcon = {
    // TODO Something like https://github.com/kimlimjustin/xplorer/tree/master/lib
    view(vnode) {
        const metadata = vnode.attrs.metadata
        return match(metadata, {
            File: info => m(Icon, {
                class: vnode.attrs.class,
                name: Icons.LINK
            }),
            Folder: info => m(Icon, {
                class: vnode.attrs.class,
                name: Icons.FOLDER
            }),
            Link: info => m(Icon, {
                class: vnode.attrs.class,
                name: Icons.FILE
            })
        })
    }
}

/**
 * Show an empty list item 
 * 
 * Show a list of loading item 
 * 
 * Show a list of loaded item 
 * 
 * Allow you to select item
 *  
 * Allows you to highlight selected item
 */
export const FilesGridView = {
    view(vnode) {
        const metadatas = vnode.attrs.metadatas;
        // TODO Empty folder icon
        if (metadatas.length === 0)
            return m("h2.empty", "Empty");
        return metadatas.map((metadata, i) => {
            if (metadata === undefined)
                return m(".skeleton", {
                    key: i,
                }, m(".icon.loading"), m(".title.loading"))
            const sysdata = unwrap(metadata).sysdata;
            if (sysdata === undefined) {
                console.error("this shouldn happen", metadata);
            }
            // TODO Find new integration for poper js this throws a worning 
            return m(Tooltip, {
                key: i,
                hoverOpenDelay: 1000,
                content: sysdata.basename,
                trigger: m("div", {
                    key: i,
                    class: `file${vnode.attrs.isSelected(i) ? " selected" : ""}`,
                    onclick() { vnode.attrs.onSelect(i) },
                    ondblclick() { vnode.attrs.open(metadata) }
                },
                    m(MimeIcon, { class: "icon", metadata }),
                    m(".title", sysdata.basename))
            })
        })
    }
}
    ;
