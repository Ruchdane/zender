import m from "mithril";
import { routes } from "../../routes";
import "../../Material/material.scss";
import Sidebar from "../../components/sidebar/sidebar";
import { Button } from "../../Material/button/button";

const model = {
    users: [
        {
            profile: "",
            name: "ruchdane",
            hostname: "origin",
        },
    ],
};

const Users = {
    oninit(vnode) {
        routes.settile();
    },
    view(vnode) {
        return (
            <>
                <Sidebar />
                <main>
                    <div>
                        <form>
                            <input type="text" placeholder="127.0.0.1" />
                            <Button>
                                <i class="bi bi-plus"></i>
                            </Button>
                        </form>
                    </div>
                    <div>
                        {model.users.map((user) => (
                            <div>
                                <img src={user.profile} />
                                <svg>
                                    <rect></rect>
                                </svg>
                                <div>
                                    {user.name}@{user.hostname}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </>
        );
    },
};
export default Users;
