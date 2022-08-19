import m from "mithril"
import { Breadcrumb, BreadcrumbItem, Button, Icon, Icons, Tooltip } from "construct-ui";
import { path } from "@tauri-apps/api";

export function Path() {
	return {
		view(vnode) {
			return m(Breadcrumb, { seperator: m(Icon, { name: Icons.CHEVRONS_RIGHT }) },
				vnode.attrs.path.split(path.sep).map((segment, index) =>
					m(BreadcrumbItem, {
						href: "#",
						onclick: () => {
							vnode.attrs.setPath(segment)
						}
					}, segment))
			)
		}
	}
}

export function Header() {
	return {
		view(vnode) {
			const option = vnode.attrs;
			const tooltip = `Toogle ${!option.list ? "list" : "grid"}  view`;
			return <div class="header">
				<Path path={option.Path} updatePath={option.updatePath}/>
				<div class="header-options">
					<Tooltip
						content={tooltip}
						trigger={<Button
							aria-label={tooltip}
							class="tool"
							iconLeft={!option.list ? Icons.LIST : Icons.GRID}
							onclick={(e) => option.onDisplayChange()} />} />
					<Button
						aria-lable="Delete selection"
						iconLeft={Icons.TRASH_2}
						disabled={option.isSelectionEmpty}
						onclick={() => option.removeSelection()} />
				</div>
			</div>;
		}
	};
}
