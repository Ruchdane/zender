import m from "mithril";
import FileView from "../file/file";
import { model } from "../../view/home/home";

export function FilesView() {
	return {
		view(vnode) {
			return vnode.attrs.isList ?
				<div class="files-grid">
					{Array.from(model.files, (path, i) => {
						return m(FileView, {
							path,
							grid: true,
							id: i,
							selected: model.header_option.isSelected(i),
							onclick: () => {
								model.header_option.clickOnElement(i);
							},
						});
					})}
				</div>
				:
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
							{Array.from(model.files, (path, i) => {
								return m(FileView, {
									path,
									grid: false,
									id: i,
									selected: model.header_option.isSelected(i),
									onclick: () => {
										model.header_option.clickOnElement(i);
									},
								});
							})}
						</tbody>
					</table>
				</div>;
		}
	};
}
