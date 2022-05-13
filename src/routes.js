import m from "mithril";
import {
    Counter
} from "./components/counter/counter";

export const routes = {
    views: [{
        title: "Counter",
        url: "/Counter",
        view: Counter
    }],
    setup() {
        var routes = {}
        this.views.forEach(view => {
            routes[view.url] = view.view
        });
        m.route(document.body, this.views[0].url, routes)
    }
}