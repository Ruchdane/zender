import m from "mithril";
import { routes } from "../../routes";

import Sidebar from "../../components/sidebar/sidebar";
import { Button } from "construct-ui";
import { GetLocalUser, GetPeer } from "../../controller/file";

const model = {
	user: undefined,
	peer: [],
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
						{model.user?.map((user, index) => (
							<div key={index}>
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
