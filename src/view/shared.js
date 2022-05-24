import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const Shared = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Shared</p>
            </div>
    }
}
export default Shared