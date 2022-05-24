import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'
import Sidebar from '../components/sidebar/sidebar'

const Home = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <>
            <Sidebar/>
            <main>
                Home
            </main>
            </>
    }
}
export default Home