import { Icon, Icons, Tooltip } from "construct-ui";
import m from "mithril";
import { MetadataType } from "../../controller/file";

const MimeIcon = {
    // TODO Something like https://github.com/kimlimjustin/xplorer/tree/master/lib
    view(vnode) {

        const metadata = vnode.attrs.metadata
        if (metadata.type === MetadataType.Link) {
            return m(Icon, {
                class: vnode.attrs.class,
                name: Icons.LINK
            })
        }
        else if (metadata.type === MetadataType.Folder) {
            return m(Icon, {
                class: vnode.attrs.class,
                name: Icons.FOLDER
            })
        }
        // File variant of Metadata overide type field of metadata
        // with the memetype
        else {
            return m(Icon, {
                class: vnode.attrs.class,
                name: Icons.FILE
            })
        }
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
            const sysdata = metadata.sysdata;
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
