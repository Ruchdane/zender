import m from 'mithril'
import { routes } from "../../routes"
import '../../Material/material.scss'
import Sidebar from '../../components/sidebar/sidebar'
import { Button } from "../../Material/button/button";
import './user.scss'
const model = {
    _peerInputValue: "",
    get peerInputValue() {
        return this._peerInputValue;
    },
    set peerInputValue(value) {
        this._peerInputValue = value.target.value;
    },
    AddPeer() {
        this.users.push({
            profile: "",
            name: "ruchdane",
            hostname: "origin",
            addresses: [{
                IPv4: "127.0.0.1",
                mask: 8,
                adapter: "loopback",
            }, {
                IPv4: "192.168.16.4",
                mask: 24,
                adapter: "wlan0",
                ssid: "Origin"
            }]
        })
    },
    hasPeer() {
        return false;//this.users.length != 0; 
    },
    user: {
        profile: "",
        name: "ruchdane",
        hostname: "origin",
        code: "ffeefefef",
        addresses: [{
            IPv4: "127.0.0.1",
            mask: 8,
            adapter: "loopback",
        }, {
            IPv4: "127.0.0.1",
            mask: 8,
            adapter: "loopback",
        }, {
            IPv4: "127.0.0.1",
            mask: 8,
            adapter: "loopback",
        }, {
            IPv4: "192.168.16.2",
            mask: 24,
            adapter: "wlan0",
            ssid: "Origin"
        }]
    },
    users: Array.from(Array(20), _ => ({
        profile: "",
        name: "ruchdane",
        hostname: "origin",
        addresses: [{
            IPv4: "127.0.0.1",
            mask: 8,
            adapter: "loopback",
        }, {
            IPv4: "192.168.16.4",
            mask: 24,
            adapter: "wlan0",
            ssid: "Origin"
        }]
    }))
};

const Users = {
    oninit(vnode) {
        routes.settile()
    },
    view(vnode) {
        return (
            <>
                <Sidebar />
                <main class="users">
                    <div class="addresse-bar">
                        <div>
                            <input type="text" placeholder="127.0.0.1" value={model.peerInputValue} onchange={model.peerInputValue} />
                            <Button onclick={(e) => model.AddPeer()}>
                                <i class="bi bi-plus"></i>
                            </Button>
                        </div>
                        <div>
                            <label for="nom">Nom</label>
                            {model.user.name}
                        </div>
                        <div>
                            <label for="code">code</label>
                            {model.user.code}
                        </div>
                        <div>
                            <label for="host">Host</label>
                            {model.user.hostname}
                        </div>
                        <center>
                            <p>
                                Addresses
                            </p>
                            <hr />
                        </center>
                        <div>
                            {model.user.addresses.map(addres => m('.addresse', [
                                m('label', addres.adapter),
                                m('span', addres.IPv4)
                            ]))}
                        </div>
                    </div>
                    {model.hasPeer() ?
                        <div>
                            <div class="users-grid">
                                {model.users.map(user =>
                                    <div class="user">
                                        {user.profile != "" ?
                                            <img src={user.profile} />
                                            : <svg width="50" height="50">
                                                <rect x="0" y="0" width="100%" height="100%" color="black">
                                                </rect>
                                            </svg>}
                                        <div class="name">
                                            {user.name}@{user.hostname}
                                        </div>
                                    </div>
                                )}</div>
                        </div>

                        :
                        <div class="no-peer"> Ajoute des peer</div>
                    }
                </main>
            </>
        );

    }
}
export default Users