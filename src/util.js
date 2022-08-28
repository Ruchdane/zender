// export function str_not_undefined(str){
//     return vnode.attrs.type !== undefined ? "-" + vnode.attrs.type : ""
// }
export function OsStringDeserialize(value) {
    return String.fromCharCode.apply(null,
        value.WINDOWS === undefined ? value.Windows : value.Unix)
}