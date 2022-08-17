import m from "mithril";
import { routes } from "../routes";
import "../Material/material.scss";
import Sidebar from "../components/sidebar/sidebar";

const Download = {
    oninit(vnode) {
        routes.settile();
    },
    view(vnode) {
        return (
            <>
                <Sidebar />
                <main>Download</main>
            </>
        );
    },
};
export default Download;
