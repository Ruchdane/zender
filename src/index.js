import m from "mithril";
import {
    Counter
} from "./components/counter/counter";
import './style.scss';

Counter
m.route(document.body, "/Counter", {
    "/Counter": Counter,
    "/Counter/1": Counter,
})