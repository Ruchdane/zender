import m from 'mithril'
import "./button.scss"

export const Button = {
    view(vnode) {
        return m('button' + vnode.attrs.type != undefined ? "-" + vnode.attrs.type : "", {
            onclick: vnode.attrs.onclick
        }, vnode.children)
    }
}