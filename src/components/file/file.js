    import m from 'mithril'
import './file.scss'
function TypeToClass(filetype) {
    var foo = ["aac", "ai", "bmp", "cs", "css", "csv", "doc", "docx", "exe", "gif", "heic", "html", "java",
        "jpg", "js", "json", "jsx", "key", "m4p", "md", "mdx", "mov", "mp3", "mp4", "otf", "php",
        "png", "pptx", "psd", "py", "raw", "rb", "sass", "scss", "sh", "svg", "tiff", "tsx", "ttf", "txt",
        "wav", "woff", "xlsx", "xml", "yml"]
    if (filetype == "folder")
        return 'folder'
    else if (foo.includes(filetype))
        return 'filetype-' + filetype
    return "file"
}
const file = {
    view(vnode) {
        return <div class={"file" + (vnode.attrs.selected ? " selected" : "")} key={vnode.attrs.id} onclick={()=>{vnode.attrs.onclick()}}>
            <i class={"bi-"+TypeToClass(vnode.attrs.file.filetype)}></i>
            <label class="text-center">{vnode.attrs.file.filename}</label>
        </div>
    }
}

export default file;