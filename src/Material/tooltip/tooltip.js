import m from 'mithril'
import './tooltip.scss'

const Tooltip = {
    view(vnode){
       return  m('.tooltip',vnode.children)
    }
}

export default Tooltip;