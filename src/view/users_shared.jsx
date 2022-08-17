import m from "mithril";
import { routes } from "../routes";
import "../Material/material.scss";
import Sidebar from "../components/sidebar/sidebar";

const UsersShared = {
    oninit(vnode) {
        routes.settile();
    },
    view(vnode) {
        return (
            <>
                <Sidebar />
                <main>Users Shared</main>
            </>
        );
    },
};
export default UsersShared;
