import m from 'mithril'
import { routes } from "../routes"

import '../Material/material.scss'
import './style.scss'
import '../Material/button/button.scss'

import Sidebar from '../components/sidebar/sidebar'
import FileView from "../components/file/file";
import Tooltip from '../Material/tooltip/tooltip.js'

import file from '../components/file/file'
const files = Array.from(Array(10), (_, i) => foo("none", "xml", "10Mb"))
const settings = {
    files:[],
    removeSelection() {
        this.files =  this.files.filter((_,i)=> !this.header_option.selection.includes(i))
        this.header_option.selection = []
    },
    header_option: {
        list: false,
        selection: [],
        isSelectionEmpty() {
            return this.selection.length != 0
        },
        isSelected(i) {
            return this.selection.includes(i)
        },
        clickOnElement(i){
            if(this.isSelected(i))
                this.selection = this.selection.filter((value)=> value!=i)
            else
                this.selection.push(i)
        },
        onListClick() {
            this.list = !this.list;
        }
    }
}
function foo(file, filetype, size) {
    return {
        filename: file,
        filetype: filetype,
        size: size
    }
}
const Home = {
    oninit(vnode) {
        routes.settile()
        settings.files = files
    },
    view(vnode) {
        return <>
            <Sidebar />
            <main class="home">
                <div class="header">
                    <div>File to share </div>
                    <div class="header-options">
                        {
                            !settings.header_option.list ?
                                <button  
                                    aria-lable="Toogle list view" 
                                    class="tool"
                                    onclick={(e) => settings.header_option.onListClick()}>
                                    <i class="bi bi-list" /> 
                                    <Tooltip> Toogle list view </Tooltip>
                                </button>
                                : <button aria-lable="Toogle grid view" onclick={(e) => settings.header_option.onListClick()}>
                                    <i class="bi bi-grid" /> </button>
                        }
                        <button>
                            <i class="bi bi-plus"></i>
                        </button>
                        <button
                            aria-lable="Delete selection"
                            disabled={!settings.header_option.isSelectionEmpty()}
                            onclick={() => settings.removeSelection()}>
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <hr />
                {
                    !settings.header_option.list
                        ? <div class="files-grid">
                            {
                                settings.files.map((file,i) => {
                                    return m(FileView, {
                                        file:file,
                                        id:i,
                                        selected:settings.header_option.isSelected(i),
                                        onclick:()=>{
                                            settings.header_option.clickOnElement(i)
                                        }
                                    })
                                })
                            }
                        </div>

                        : <div >
                            <table class="table files-list">
                                <thead>
                                    <tr>
                                        <th scope="col">Nom</th>
                                        <th scope="col">Type</th>
                                        <th scope="col">Taille</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {settings.files.map((file,i) => {
                                        return <tr class={settings.header_option.isSelected(i) ? "file selected" : "file"} 
                                        onclick={()=>settings.header_option.clickOnElement(i)}>
                                            <td>{file.filename}</td>
                                            <td>{file.filetype}</td>
                                            <td>{file.size}</td>
                                        </tr>
                                    })}
                                </tbody>
                            </table>
                        </div>
                }
            </main>
        </>
    }
}
export default Home