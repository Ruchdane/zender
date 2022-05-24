import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'
import Sidebar from '../components/sidebar/sidebar'

const Material = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Material design showcase</p>
            </div>
    }
}
export default Material