import m from "mithril";
import { Button, Icons } from "construct-ui";

/**
 * List all known users(connected or not)
 * Search users
 * Display info about yourself
 */

export function IpForm() {
    const ip = [127, 0, 0, 1];
    let port = 8977;
    return {
        view(vnode) {
            return (
                <form>
                    <div class="inline addresses-input">
                        {ip.map((value, key) =>
                            m("input", {
                                key,
                                type: "number",
                                min: "0",
                                max: "255",
                                value,
                                onchange(e) {
                                    const value = e.target.value;
                                    if (value >= 0 && value < 256)
                                        ip[key] = e.target.value;
                                },
                            })
                        )}
                    </div>
                    <input
                        type="number"
                        min="1025"
                        max="65377"
                        placeholder="8977"
                        value={port}
                        onchange={(e) => {
                            const value = e.target.value;
                            if (value >= 1025 && value < 65377)
                                port = e.target.value;
                        }}
                    />
                    <Button
                        iconLeft={Icons.SEARCH}
                        onclick={() =>
                            vnode.attrs.onSearch(ip.join(".") + ":" + port)
                        }
                    />
                </form>
            );
        },
    };
}
