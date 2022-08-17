import m from "mithril";
import download from "./view/download.jsx";
import home from "./view/home/home.jsx";
import settings from "./view/settings.jsx";
import shared from "./view/shared.jsx";
import shared_detail from "./view/shared_detail.jsx";
import users from "./view/users/users.jsx";
import users_shared from "./view/users_shared.jsx";

function View(title, url, view) {
    this.title = title;
    this.url = url;
    this.view = view;
}
export const routes = {
    views: [
        new View("Home", "/home", home),
        new View("Users", "/users", users),
        new View("Users Shared", "/users/:user_id", users_shared),
        new View("Download", "/download", download),
        new View("Shared", "/shared", shared),
        new View("Shared Detail", "/shared/detail", shared_detail),
        new View("Settings", "/settings", settings),
        // new View("Material","/material",material),
    ],
    setup() {
        const routes = {};
        this.views.forEach((view) => {
            routes[view.url] = view.view;
        });
        m.route(document.body, this.views[0].url, routes);
    },
    settile() {
        const url = m.route.get();
        for (const view of this.views) {
            if (view.url == url) {
                document.title = view.title;
                return;
            }
        }
    },
};
