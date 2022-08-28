import { invoke } from "@tauri-apps/api";
import { log } from "./error";
// I would like to switch to typescript 
// https://dev.to/dimfeld/synchronizing-rust-types-with-typescript-1maa

// Is it necessary why not simply use the invoke 
// and let them handle the error
export const MetadataType = {
	File: "File",
	Folder: "Folder",
	Link: "Link",
}
// FIXME error lorsqu'on recherche les metadata de C
export async function GetMetadata(path) {
	try {
		const metadata = await invoke("get_metadata_of_path", { path });
		setTimeout(() => { }, 1000000);
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

export async function GetLocalUser() {
	try {
		const user = await invoke("get_local_user");
		return user
	} catch (err) {
		return await log(err);
	}
}

export async function GetPeer() {
	try {
		// const user = await invoke("get_local_user");
		return []
		// eslint-disable-next-line no-unreachable
	} catch (err) {
		return await log(err);
	}
}