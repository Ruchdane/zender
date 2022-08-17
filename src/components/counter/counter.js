import m from "mithril";
import "./counter.scss";
import { Button } from "construct-ui";

export const Counter = (initialVnode) => {
    let count = 0;

    function increment() {
        count++;
    }

    function decrement() {
        count--;
    }

    return {
        view: function (vnode) {
            return (
                <div>
                    <p> Count {count}</p>
                    <Button type="primary" onclick={decrement}>
                        Decrement{" "}
                    </Button>
                    <Button type="secondary" onclick={increment}>
                        Increment{" "}
                    </Button>
                </div>
            );
            //  m("div",
            //     m("p", "Count: " + count),
            //     m("button", {
            //         onclick: increment
            //     }, "Increment"),
            //     m("button", {
            //         onclick: decrement
            //     }, "Decrement")
            // )
        },
    };
};
