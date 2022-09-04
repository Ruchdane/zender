import m from "mithril";
import { Spinner } from "construct-ui";

export const FilesListView = {
    view(vnode) {
        const files = vnode.attrs.files;
        return <table class="table files-list">
            <thead>
                <tr>
                    <th scope="col">Nom</th>
                    <th scope="col">Type</th>
                    <th scope="col">Taille</th>
                </tr>
            </thead>
            <tbody>
                {
                    files ?
                        (files.length === 0 ? files.map((file, i) => {
                            return m("tr", {
                                key: i,
                                selected: vnode.attrs.isSelected(i),
                                onclick() { vnode.attrs.select(i) },
                                ondbclick() { vnode.attrs.ondbclick(i) }
                            }, file.path);
                        }) :
                            m("h2", "nothing")
                        ) :
                        m(Spinner)
                }

            </tbody>
        </table>;
    }
};
