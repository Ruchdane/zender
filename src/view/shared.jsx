import m from "mithril";
import { routes } from "../routes";
import "../Material/material.scss";
import Sidebar from "../components/sidebar/sidebar";

const Shared = {
    oninit(vnode) {
        routes.settile();
    },
    view(vnode) {
        return (
            <>
                <Sidebar />
                <main>Shared</main>
            </>
        );
    },
};
export default Shared;
