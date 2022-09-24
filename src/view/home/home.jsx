import m from "mithril";
import { routes } from "../../routes";

import "./home.scss";

import Sidebar from "../../components/sidebar/sidebar";
import { FilesGridView } from "./FilesGridView";
import { FilesListView } from "./FilesListView";
import { Path } from "./Path";
import { Button, Icons, Tooltip } from "construct-ui";
import { model, filesModel } from "../../controller/files";
const viewModel = {
    selection: new Set(),
    // TODO add button for this
    showHidden: false,
    displayList: false,
    switchDisplay() {
        this.displayList = !this.displayList;
    },
    addSelection(i) {
        // So try to delete it if it send false then it doesn't exist so ceate
        if (!this.selection.delete(i)) this.selection.add(i);
    },
    shareSelection() {
        console.log(this.selection.values());
        this.selection.clear();
    },
};

const Home = {
    oninit(vnode) {
        routes.settile();
        model.init().then(() => m.redraw());
    },
    view(vnode) {
        const displayName = viewModel.displayList ? "list" : "grid";
        const tooltip = `Toogle ${
            !viewModel.displayList ? "list" : "grid"
        }  view`;
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
                                            !viewModel.displayList
                                                ? Icons.LIST
                                                : Icons.GRID
                                        }
                                        onclick={(e) =>
                                            viewModel.switchDisplay()
                                        }
                                    />
                                }
                            />
                            <Tooltip
                                content="share selection"
                                trigger={
                                    <Button
                                        aria-label="share selection"
                                        iconLeft={Icons.SHARE}
                                        onclick={(e) =>
                                            viewModel.shareSelection()
                                        }
                                    />
                                }
                            />
                        </div>
                    </div>
                    <hr />
                    <div class={`files-${displayName}`}>
                        {m(
                            viewModel.displayList
                                ? FilesListView
                                : FilesGridView,
                            {
                                metadatas: filesModel.metadatas,
                                showHidden: viewModel.showHidden,
                                isSelected(i) {
                                    return viewModel.selection?.has(i);
                                },
                                onSelect(i) {
                                    viewModel.addSelection(i);
                                },
                                open(metadata) {
                                    model.load(metadata);
                                },
                            }
                        )}
                    </div>
                </main>
            </>
        );
    },
};
export default Home;
