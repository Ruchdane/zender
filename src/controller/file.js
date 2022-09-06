import { invoke } from "@tauri-apps/api";
import { log } from "./error";
import { match } from "./pattern";
/**
 * @typedef {import("../../../types/metadata").Metadata} Metadata
 * @typedef {import("../../../types/metadata").Sysdata} Sysdata
 * @typedef {import("../../../types/metadata").FolderMetadata} FolderMetadata
 * @typedef {import("../../../types/metadata").FileMetadata} FileMetadata
 * @typedef {import("../../../types/metadata").LinkMetadata} LinkMetadata
 */

// TODO check tha whenever match is used on metadate the args are in this array
// export const MetadataType = ["File", "Folder", "Link"]

// Is it necessary why not simply use the invoke 
// and let them handle the error
// FIXME error lorsqu'on recherche les metadata de C
// Are these function realy necessary
/**
 * @param {string} path 
 * @returns {Promise<Metadata>}
 */
export async function GetMetadata(path) {
	try {
		return await invoke("get_metadata_of_path", { path });
	} catch (err) {
		throw log(err);
	}
}

/**
 * @param {string} path 
 * @returns {Promise<Sysdata>}
 */
export async function GetSysdata(path) {
	try {
		return await invoke("get_sysdata_of_path", { path });
	} catch (err) {
		throw log(err);
	}
}
/**
 * 
 * @param {import("../../types/metadata").OsString} value 
 * @returns 
 */
export function OsStringDeserialize(value) {
	try {
		return match(value, {
			Unix: encodedString => encodedString,
			Windows: encodeString => String.fromCharCode.apply(null, encodeString)
		});
	} catch (value) {
		return value
	}
}