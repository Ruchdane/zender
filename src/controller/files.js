import m from "mithril";
import { invoke, path } from "@tauri-apps/api";
import { match, unwrap } from "./pattern";

export const filesModel = {
    metadatas: [],
    async load(paths) {
        this.metadatas = Array.from(paths, () => undefined);
        let metadata;
        let sysdata;
        for (let i = 0; i < this.metadatas.length; i++) {
            try {
                metadata = await invoke("get_metadata_of_path", {
                    path: paths[i],
                });
            } catch (error) {
                // this.metadatas = this.metadatas.splice(i);
                // paths = paths.splice(i);
                // i -= 1;
                continue;
            }
            sysdata = unwrap(metadata).sysdata;
            sysdata.basename = String.fromCharCode.apply(
                null,
                unwrap(sysdata.basename)
            );
            this.metadatas[i] = metadata;
            m.redraw();
        }
        this.metadatas = this.metadatas.filter((val) => val !== undefined);
    },
};

export const model = {
    files: [],
    _path: "",
    get path() {
        return this._path;
    },
    set path(value) {
        if (this._path !== value) {
            invoke("get_metadata_of_path", { path: value }).then((metadata) =>
                this.load(unwrap(metadata))
            );
        }
    },
    load(metadata) {
        if (metadata.sysdata.is_dir) {
            this._path = metadata.sysdata.path;
            model.files = metadata.children;
            filesModel.load(model.files);
        }
    },
    async init() {
        model._path = await path.homeDir();
        const metadata = await invoke("get_metadata_of_path", {
            path: model._path,
        });
        match(metadata, {
            Folder: (info) => {
                model.files = info.children;
                filesModel.load(model.files);
            },
        });
    },
    async goToParentDir() {
        const pathItem = this._path.split(path.sep);
        pathItem.pop();
        pathItem.pop();
        pathItem.push("");
        const result = pathItem.join(path.sep);
        const metadata = unwrap(
            await invoke("get_metadata_of_path", { path: result })
        );
        this.load(metadata);
    },
    canGoToParentDir() {
        return this.path.split(path.sep).length === 1;
    },
};
