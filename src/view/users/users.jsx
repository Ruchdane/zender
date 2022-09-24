import m from "mithril";
import { routes } from "../../routes";

import Sidebar from "../../components/sidebar/sidebar";
import model from "../../controller/user.js";
import networkModel from "../../controller/network.js";

import "./user.scss";
import { IpForm } from "./IpForm";

const Users = {
    oninit(vnode) {
        routes.settile();
        model.init();
        networkModel.init();
    },
    view(vnode) {
        const user = model.user;
        return (
            <>
                <Sidebar />
                <main class="users">
                    <div class="host-info">
                        <div>
                            <IpForm
                                onSearch={(value) =>
                                    networkModel.connect(value)
                                }
                            />
                        </div>
                        <div>
                            {user === undefined
                                ? m(
                                      ".host.loadinng",
                                      m(".name"),
                                      m(
                                          "ul.addresses",
                                          Array(4).map(() => m("li.addresse"))
                                      )
                                  )
                                : m(
                                      ".host",
                                      m(
                                          ".name",
                                          user.username +
                                              "@" +
                                              user.hostname +
                                              ":" +
                                              networkModel.port
                                      ),
                                      m(
                                          "ul.addresses",
                                          user.adapter.map((adapter) => {
                                              if (adapter.ips[0][0] === "0")
                                                  return null;
                                              return m(
                                                  "li.addresse",
                                                  m(
                                                      ".name",
                                                      adapter.description
                                                  ),
                                                  m(
                                                      ".ip",
                                                      adapter.ips[0].split(
                                                          "/"
                                                      )[0]
                                                  )
                                              );
                                          })
                                      )
                                  )}
                        </div>
                    </div>
                    {model.peers.length === 0 ? (
                        <div class="no-peer"></div>
                    ) : (
                        <div class="peer"></div>
                    )}
                </main>
            </>
        );
    },
};
export default Users;
