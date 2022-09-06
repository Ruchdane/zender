import { message } from "@tauri-apps/api/dialog";
/**
 * @typedef {import("../../types/errorr").Error} Error
 */

/**
 * @param {Error} error 
 * @return {Error}
 */
export const log = (error) => {
	message(error, { type: "error" });
	return error
};
