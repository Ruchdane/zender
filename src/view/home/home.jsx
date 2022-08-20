import m from "mithril";
import { routes } from "../../routes";
import { path } from "@tauri-apps/api";

import "./home.scss";

import Sidebar from "../../components/sidebar/sidebar";
import { FilesGridView } from "./FilesGridView";
import { FilesListView } from "./FilesListView";
import { Path } from "./Path";
import { Button, Icons, Tooltip } from "construct-ui";
import { GetNonHiddenFilesInPath } from "../../controller/file";

// import file from "../../components/file/file";
export const model = {
	files: [],
	selection: new Set(),
	_path: "",
	get path() {
		return this._path;
	},
	set path(value) {
		if (this._path !== value)
			this._path = value;
	},
	async init() {
		try {
			model._path = await path.homeDir();
			model.files = await GetNonHiddenFilesInPath(model._path);
		} catch (error) {
			console.log(error);
		}
	},
	goToParentDir() {
		this._path = this._path.substring(0, this._path.length - 1).slice(0, this._path.lastIndexOf(path.sep))
	},
	displayList: false,
	switchDisplay() {
		this.displayList = !this.displayList
	},
	addSelection(i) {
		// So try to delete it if it send false then it doesn't exist so ceate
		if (this.selection.delete(i))
			this.selection.add(i)
	},
};
const Home = {
	oninit(vnode) {
		routes.settile();
		model.init().then(() => m.redraw())
	},
	view(vnode) {
		const displayName = model.displayList ? "list" : "grid";
		const tooltip = `Toogle ${displayName}  view`
		return (
			<>
				<Sidebar />
				<main class="home">
					<div class="header">
						<div>
							<Tooltip
								content="Go to parent dir"
								trigger={<Button
									aria-label={"Go to parent dir"}
									iconLeft={Icons.ARROW_UP_RIGHT}
									onclick={(e) => model.goToParentDir()} />
								} />
							<Path
								path={model.path}
								updatePath={(newPath) => (model.path = newPath)}
							/>
						</div>
						<div class="header-options">
							<Tooltip
								content={tooltip}
								trigger={<Button
									aria-label={tooltip}
									iconLeft={!model.displayList ? Icons.LIST : Icons.GRID}
									onclick={(e) => model.switchDisplay()} />
								} />
						</div>
					</div>
					<hr />
					<div class={`files-${displayName}`}>
						{
							m(model.displayList ? FilesListView : FilesGridView, {
								files: model.files,
								isSelected(i) {
									model.selection?.has(i)
								},
								onclick(i) {
									model.addSelection(i)
								},
								onDoubleClick(i) {
									model.path = model.files[i]?.path
								}
							})
						}
					</div>

				</main>
			</>
		);
	},
};
export default Home;
