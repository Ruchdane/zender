import { invoke } from "@tauri-apps/api";
import { log } from "./error";

export async function GetNonHiddenFilesInPath(path) {
	try {
		const metadata = await invoke("get_files_in_path", { path, hiden: false, link: true });
		return metadata;
	} catch (err) {
		return await log(err);
	}
}

export async function GetSysdata(path) {
	try {
		const sysdata = await invoke("get_sysdata_of_path", { path });
		return sysdata
	} catch (err) {
		return await log(err);
	}
}