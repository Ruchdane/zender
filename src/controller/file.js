import { open } from "@tauri-apps/api/dialog";
import { invoke } from "@tauri-apps/api";
import { log } from "./error";
function AddFiles(callback) {
	return open({
		multiple: true,
	})
		.then((value) => callback(value))
		.catch((err) => log(err));
}
function GetFilesProperties(path, callback) {
	return invoke("get_file_metadata", { path })
		.then((metadata) => callback(metadata))
		.catch((err) => log(err));
}

export { AddFiles, GetFilesProperties };
