import m from 'mithril'
import Item from './item';

import './sidebar.scss'

const Sidebar = {
    view(vnode) {
        return <aside class="sidebar">
            <ul class="top-items">
                <Item icon="app"   url="/home" title="Acceuil" />
                <Item icon="people" active url="/users" title="Acceuil" />
                <Item icon="download" url="/download" title="Acceuil" />
                <Item icon="upload" url="/shared" title="Acceuil" />
                </ul>
            <ul class="bottom-items">
                <Item icon="gear" url="/settings" title="Acceuil" />
            </ul>
        </aside>
    }
}
export default Sidebar;




