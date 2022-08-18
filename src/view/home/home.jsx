import m from "mithril";
import { routes } from "../../routes";
import { AddFiles } from "../../controller/file";

import "../style.scss";

import Sidebar from "../../components/sidebar/sidebar";
import FileView from "../../components/file/file";
import { Button, Icons, Tooltip } from "construct-ui";

// import file from "../../components/file/file";

const settings = {
	files: new Set(),
	removeSelection() {
		this.files = new Set(
			[...this.files].filter((_, x) => !this.header_option.selection.has(x))
		);
		this.header_option.selection.clear();
	},
	onAddFiles(e) {
		AddFiles((files) => {
			files.forEach((file) => settings.files.add(file));
			m.redraw();
		});
	},
	header_option: {
		list: false,
		selection: new Set(),
		isSelectionEmpty() {
			return this.selection.size !== 0;
		},
		isSelected(i) {
			return this.selection.has(i);
		},
		clickOnElement(i) {
			if (!this.selection.delete(i)) this.selection.add(i);
		},
		onListClick() {
			this.list = !this.list;
		},
	},
};
const Home = {
	oninit(vnode) {
		routes.settile();
	},
	view(vnode) {
		function viewTypeTooltip() {
			return `Toogle ${!settings.header_option.list ? "list" : "grid"}  view`;
		}
		return (
			<>
				<Sidebar />
				<main class="home">
					<div class="header">
						<div>Fichier a partager </div>
						<div class="header-options">
							<Tooltip
								content={viewTypeTooltip()}
								trigger={
									<Button
										aria-label={viewTypeTooltip()}
										class="tool"
										iconLeft={
											!settings.header_option.list ? Icons.LIST : Icons.GRID
										}
										onclick={(e) => settings.header_option.onListClick()}
									/>
								}
							/>
							<Button onclick={settings.onAddFiles} iconLeft={Icons.PLUS} />
							<Button
								aria-lable="Delete selection"
								iconLeft={Icons.TRASH_2}
								disabled={!settings.header_option.isSelectionEmpty()}
								onclick={() => settings.removeSelection()}
							/>
						</div>
					</div>
					<hr />
					{!settings.header_option.list ? (
						<div class="files-grid">
							{Array.from(settings.files, (path, i) => {
								return m(FileView, {
									path,
									grid: true,
									id: i,
									selected: settings.header_option.isSelected(i),
									onclick: () => {
										settings.header_option.clickOnElement(i);
									},
								});
							})}
						</div>
					) : (
						<div>
							<table class="table files-list">
								<thead>
									<tr>
										<th scope="col">Nom</th>
										<th scope="col">Type</th>
										<th scope="col">Taille</th>
									</tr>
								</thead>
								<tbody>
									{Array.from(settings.files, (path, i) => {
										return m(FileView, {
											path,
											grid: false,
											id: i,
											selected: settings.header_option.isSelected(i),
											onclick: () => {
												settings.header_option.clickOnElement(i);
											},
										});
									})}
								</tbody>
							</table>
						</div>
					)}
				</main>
			</>
		);
	},
};
export default Home;
