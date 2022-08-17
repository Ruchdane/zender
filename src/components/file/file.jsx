import m from "mithril";
import { GetFilesProperties } from "../../controller/file";
import "./file.scss";
function TypeToClass(extension, isDir) {
    const foo = [
        "aac",
        "ai",
        "bmp",
        "cs",
        "css",
        "csv",
        "doc",
        "docx",
        "exe",
        "gif",
        "heic",
        "html",
        "java",
        "jpg",
        "js",
        "json",
        "jsx",
        "key",
        "m4p",
        "md",
        "mdx",
        "mov",
        "mp3",
        "mp4",
        "otf",
        "php",
        "png",
        "pptx",
        "psd",
        "py",
        "raw",
        "rb",
        "sass",
        "scss",
        "sh",
        "svg",
        "tiff",
        "tsx",
        "ttf",
        "txt",
        "wav",
        "woff",
        "xlsx",
        "xml",
        "yml",
    ];
    if (isDir) return "folder";
    else if (foo.includes(extension)) return "filetype-" + extension;
    return "file";
}

function ExtensionToType(extension, isDir) {
    if (isDir) {
        return "Dossier";
    }
    return extension;
}

function file(initVnode) {
    let metadata = {
        file_path: "",
        basename: "unknown",
        isDir: false,
        is_file: false,
        size: 0,
        last_modified: null,
        last_accessed: null,
        created: null,
    };
    function GetExtension(metadata) {
        return metadata.basename.substring(
            metadata.basename.lastIndexOf(".") + 1
        );
    }
    function init(path) {
        GetFilesProperties(path, (fileMetadata) => {
            metadata = fileMetadata;
            m.redraw();
        });
    }
    return initVnode.attrs.grid
        ? {
              oninit(vnode) {
                  init(vnode.attrs.path);
              },
              view(vnode) {
                  return (
                      <div
                          class={
                              "file" + (vnode.attrs.selected ? " selected" : "")
                          }
                          key={vnode.attrs.id}
                          onclick={vnode.attrs.onclick}>
                          <i
                              class={
                                  "bi-" +
                                  TypeToClass(
                                      GetExtension(metadata),
                                      metadata.isDir
                                  )
                              }
                          />
                          <label class="text-center">{metadata.basename}</label>
                      </div>
                  );
              },
          }
        : {
              oninit(vnode) {
                  init(vnode.attrs.path);
              },
              view(vnode) {
                  return (
                      <tr
                          class={
                              "file" + (vnode.attrs.selected ? " selected" : "")
                          }
                          onclick={vnode.attrs.onclick}>
                          <td>{metadata.basename}</td>
                          <td>{ExtensionToType(GetExtension(metadata))}</td>
                          <td>{!metadata.isDir ? metadata.size : ""}</td>
                      </tr>
                  );
              },
          };
}

export default file;
