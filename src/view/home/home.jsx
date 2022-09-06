import m from "mithril";
import { routes } from "../../routes";
import { path } from "@tauri-apps/api";

import "./home.scss";

import Sidebar from "../../components/sidebar/sidebar";
import { FilesGridView } from "./FilesGridView";
import { FilesListView } from "./FilesListView";
import { Path } from "./Path";
import { Button, Icons, Tooltip } from "construct-ui";
import { GetMetadata, OsStringDeserialize } from "../../controller/file";
import { match, unwrap } from "../../controller/pattern";

export const filesModel = {
    metadatas: [],
    async load(paths) {
        this.metadatas = Array.from(paths, () => undefined);
        let metadata;
        let sysdata;
        for (let i = 0; i < this.metadatas.length; i++) {
            metadata = await GetMetadata(paths[i]);
            sysdata = unwrap(metadata).sysdata;
            sysdata.basename = OsStringDeserialize(sysdata.basename);
            this.metadatas[i] = metadata;
            m.redraw();
        }
    },
};

export const model = {
    files: [],
    selection: new Set(),
    _path: "",
    get path() {
        return this._path;
    },
    set path(value) {
        if (this._path !== value) {
            GetMetadata(value).then((metadata) => this.load(metadata));
        }
    },
    load(metadata) {
        if (!metadata.is_dir) return;
        this._path = metadata.sysdata.path;
        model.files = metadata.children;
        filesModel.load(model.files);
    },
    async init() {
        model._path = await path.homeDir();
        const metadata = await GetMetadata(model._path);
        match(metadata, {
            Folder: info => {
                model.files = info.children;
                filesModel.load(model.files);
            }
        })
    },
    shareSelection() {
        console.log(this.selection.values());
        this.selection.clear();
    },
    async goToParentDir() {
        const result = getParentPath(this._path, path.sep);
        const metadata = unwrap(await GetMetadata(result));
        this.load(metadata);
    },
    canGoToParentDir() {
        return this.path.split(path.sep).length === 1;
    },
    displayList: false,
    switchDisplay() {
        this.displayList = !this.displayList;
    },
    addSelection(i) {
        // So try to delete it if it send false then it doesn't exist so ceate
        if (!this.selection.delete(i)) this.selection.add(i);
    },
};
const Home = {
    oninit(vnode) {
        routes.settile();
        model.init().then(() => m.redraw());
    },
    view(vnode) {
        const displayName = model.displayList ? "list" : "grid";
        const tooltip = `Toogle ${!model.displayList ? "list" : "grid"}  view`;
        return (
            <>
                <Sidebar />
                <main class="home">
                    <div class="header">
                        <div>
                            <Tooltip
                                content="Go to parent dir"
                                trigger={
                                    <Button
                                        disabled={model.canGoToParentDir()}
                                        aria-label={"Go to parent dir"}
                                        iconLeft={Icons.ARROW_UP_RIGHT}
                                        onclick={(e) => model.goToParentDir()}
                                    />
                                }
                            />
                            <Path
                                path={model.path}
                                updatePath={(newPath) => (model.path = newPath)}
                            />
                        </div>
                        <div class="header-options">
                            <Tooltip
                                content={tooltip}
                                trigger={
                                    <Button
                                        aria-label={tooltip}
                                        iconLeft={
                                            !model.displayList
                                                ? Icons.LIST
                                                : Icons.GRID
                                        }
                                        onclick={(e) => model.switchDisplay()}
                                    />
                                }
                            />
                            <Tooltip
                                content="share selection"
                                trigger={
                                    <Button
                                        aria-label="share selection"
                                        iconLeft={Icons.SHARE}
                                        onclick={(e) => model.shareSelection()}
                                    />
                                }
                            />
                        </div>
                    </div>
                    <hr />
                    <div class={`files-${displayName}`}>
                        {m(model.displayList ? FilesListView : FilesGridView, {
                            metadatas: filesModel.metadatas,
                            isSelected(i) {
                                return model.selection?.has(i);
                            },
                            onSelect(i) {
                                model.addSelection(i);
                            },
                            open(metadata) {
                                model.load(metadata);
                            },
                        })}
                    </div>
                </main>
            </>
        );
    },
};
export default Home;
function getParentPath(path, sep) {
    const pathItem = path.split(sep);
    pathItem.pop();
    pathItem.pop();
    pathItem.push("");
    return pathItem.join(sep);
}
