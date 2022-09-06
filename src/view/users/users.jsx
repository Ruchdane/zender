import m from "mithril";
import { routes } from "../../routes";

import Sidebar from "../../components/sidebar/sidebar";
import { Button, Icons } from "construct-ui";
import { GetLocalUser, GetPeer } from "../../controller/user";

import './user.scss'


const model = {
	user: undefined,
	peers: [],
	async init() {
		this.user = await GetLocalUser();
		this.peer = await GetPeer();
	}
};
/**
 * List all known users(connected or not)
 * Search users
 * Display info about yourself
 */
const Users = {
	oninit(vnode) {
		routes.settile();
		model.init().then(() => m.redraw())
	},
	view(vnode) {
		const user = model.user;
		return (
			<>
				<Sidebar />
				<main class="users">
					<div class="host-info">
						<div>
							<form>
								<input type="text" placeholder="127.0.0.1" />
								<Button iconLeft={Icons.SEARCH}
								/>
							</form>
						</div>
						<div>
							{
								user === undefined
									? m(".host.loadinng", m(".name"), m("ul.addresses", Array(4).map(() => m("li.addresse"))))
									: m(".host",
										m(".name", user.username + "@" + user.hostname),
										m("ul.addresses", user.adapter.map((adapter) => {
											// TODO #Backend don't add adapter with null addresses
											if (adapter.ips[0][0] === '0')
												return null
											return m("li.addresse",
												m(".name", adapter.description),
												m(".ip", adapter.ips[0].split('/')[0]))
										}
										)))
							}
						</div>

					</div>
					{
						model.peers.length === 0 ?
							<div class="no-peer"></div>
							: <div class="peer"></div>
					}
				</main>
			</>
		);
	},
};
export default Users;
