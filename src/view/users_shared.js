import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const UsersShared = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>UsersShared</p>
            </div>
    }
}
export default UsersShared