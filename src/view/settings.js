import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'
import Sidebar from '../components/sidebar/sidebar'

const Settings = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return<>
        <Sidebar />
        <main>
            Settings
        </main>
    </>
    }
}
export default Settings