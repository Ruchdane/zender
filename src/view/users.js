import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const Users = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Users</p>
            </div>
    }
}
export default Users