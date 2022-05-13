import m from 'mithril'
import "./counter.scss"

export const Counter = (initialVnode) => {
    var count = 0

    function increment() {
        count++;
    }

    function decrement() {
        count--;
    }

    return {
        view: function(vnode) {
            return <div>
                <p> Count {count }</p>
                <button onclick={increment}>Increment </button>
                <button onclick={decrement}>Decrement </button>
            </div>
            //  m("div",
            //     m("p", "Count: " + count),
            //     m("button", {
            //         onclick: increment
            //     }, "Increment"),
            //     m("button", {
            //         onclick: decrement
            //     }, "Decrement")
            // )
        }
    }
} 