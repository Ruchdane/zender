import m from "mithril";
import { routes } from "../../routes";

import "./home.scss";

import Sidebar from "../../components/sidebar/sidebar";
import { Header } from "../../components/home/Header";
import { FilesView } from "../../components/home/FilesView";
import { TreeView } from "../../components/home/TreeView";
import { path } from "@tauri-apps/api";

// import file from "../../components/file/file";

export const model = {
	files: new Set(),
	selection: new Set(),
	path: "Fuck/you/to/the/moon",
	displayList: false,
	onSelectionAdd(item) {
		// So try to delete it if it send false then it doesn't exist so ceate
		if (this.selection.delete(item))
			this.selection.add(item)
	},
};
const Home = {
	oninit(vnode) {
		routes.settile();
		path.homeDir().then((value) => { model.path = value })
	},
	view(vnode) {
		return (
			<>
				<Sidebar />
				<main class="home">
					<Header

						path={model.path}
						updatePath={(value) => { model.path = value }}

						list={model.displayList}
						onDisplayChange={(e) => (model.displayList = !model.displayList)}
						isSelectionEmpty={model.selection.size === 0}
						removeSelection={() => model.removeSelection()}
					/>
					<hr />
					<div>
						<TreeView />
						<FilesView isList={model.displayList} />
					</div>
				</main>
			</>
		);
	},
};
export default Home;
