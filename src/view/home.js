import m from 'mithril'
import { routes } from "../routes"
import '../Material/material.scss'

const Home = {
    oninit(vnode){
        routes.settile()
    },
    view(vnode){
        return <div class="app">
            <p>Home</p>
            </div>
    }
}
export default Home