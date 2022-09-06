import { invoke } from "@tauri-apps/api";
import { log } from "./error";
/**
 * @typedef {Promise<import("../../types/user").User>} User
 */

/**
 * @return {User}
 */
export async function GetLocalUser() {
    try {
        const user = await invoke("get_local_user");
        return user;
    } catch (err) {
        throw log(err);
    }
}

/**
 * @return {Array[User]}
 */
export async function GetPeer() {
    try {
        return await invoke("get_peers");
    } catch (err) {
        throw log(err);
    }
}
