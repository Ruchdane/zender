import { message } from "@tauri-apps/api/dialog";

export const log = async (error) => {
    await message(error, { type: "error" });
};
