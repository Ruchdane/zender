import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const Download = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Download</p>
            </div>
    }
}
export default Download