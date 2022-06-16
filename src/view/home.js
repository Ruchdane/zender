import m from "mithril";
import { routes } from "../routes";
import { AddFiles } from "../controller/file";
import "../Material/material.scss";
import "./style.scss";
import "../Material/button/button.scss";

import Sidebar from "../components/sidebar/sidebar";
import FileView from "../components/file/file";
import Tooltip from "../Material/tooltip/tooltip.js";

import file from "../components/file/file";

const settings = {
	files: new Set(),
	removeSelection() {
		this.files = new Set(
			[...this.files].filter(
				(_, x) => !this.header_option.selection.has(x)
			)
		);
		this.header_option.selection.clear();
	},
	onAddFiles(e) {
		AddFiles(files => {
			files.forEach(file => settings.files.add(file));
			m.redraw();
		});
	},
	header_option: {
		list: false,
		selection: new Set(),
		isSelectionEmpty() {
			return this.selection.size != 0;
		},
		isSelected(i) {
			return this.selection.has(i);
		},
		clickOnElement(i) {
			if (!this.selection.delete(i)) this.selection.add(i);
		},
		onListClick() {
			this.list = !this.list;
		}
	}
};
const Home = {
	oninit(vnode) {
		routes.settile();
	},
	view(vnode) {
		return (
			<>
				<Sidebar />
				<main class="home">
					<div class="header">
						<div>Fichier a partager </div>
						<div class="header-options">
							{!settings.header_option.list ? (
								<button
									aria-lable="Toogle list view"
									class="tool"
									onclick={e =>
										settings.header_option.onListClick()
									}
								>
									<i class="bi bi-list" />
									<Tooltip> Toogle list view </Tooltip>
								</button>
							) : (
								<button
									aria-lable="Toogle grid view"
									onclick={e =>
										settings.header_option.onListClick()
									}
								>
									<i class="bi bi-grid" />{" "}
								</button>
							)}
							<button onclick={settings.onAddFiles}>
								<i class="bi bi-plus"></i>
							</button>
							<button
								aria-lable="Delete selection"
								disabled={
									!settings.header_option.isSelectionEmpty()
								}
								onclick={() => settings.removeSelection()}
							>
								<i class="bi bi-trash"></i>
							</button>
						</div>
					</div>
					<hr />
					{!settings.header_option.list ? (
						<div class="files-grid">
							{Array.from(settings.files, (path, i) => {
								return m(FileView, {
									path: path,
									grid: true,
									id: i,
									selected: settings.header_option.isSelected(
										i
									),
									onclick: () => {
										settings.header_option.clickOnElement(
											i
										);
									}
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
											path: path,
											grid: false,
											id: i,
											selected: settings.header_option.isSelected(
												i
											),
											onclick: () => {
												settings.header_option.clickOnElement(
													i
												);
											}
										});
									})}
								</tbody>
							</table>
						</div>
					)}
				</main>
			</>
		);
	}
};
export default Home;
