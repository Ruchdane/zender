import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const SharedDetail = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>SharedDetail</p>
            </div>
    }
}
export default SharedDetail