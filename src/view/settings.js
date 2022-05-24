import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const Settings = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Settings</p>
            </div>
    }
}
export default Settings