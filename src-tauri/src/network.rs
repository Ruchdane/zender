extern crate pnet;
use std::net::SocketAddr;
use std::sync::Mutex;

use log::info;
use pnet_datalink::interfaces;
use schemars::JsonSchema;
use serde::Serialize;
use tauri::State;
use tokio::net::{TcpListener, TcpStream};

use crate::error::Result;
use crate::user::User;

// When the user is asked for his information use
// the listener from the netwokr state to get them
#[derive(Serialize, Clone, Debug, JsonSchema)]
pub struct Adapter {
    pub name: String,
    pub description: String,
    index: u32,
    pub ips: Vec<String>,
}

impl Adapter {
    pub fn get_adapter_list() -> Vec<Adapter> {
        interfaces()
            .iter()
            .map(|interface| Adapter {
                name: interface.name.clone(),
                description: interface.description.clone(),
                index: interface.index,
                ips: interface.ips.iter().map(|ip| ip.to_string()).collect(),
            })
            .collect()
    }
}

pub struct NetworkState {
    pub listener: TcpListener,
    pub peers: Mutex<Vec<User>>,
}

impl NetworkState {
    pub async fn init(port: u16) -> Result<NetworkState> {
        let addrs = [
            SocketAddr::from(([0, 0, 0, 0], port)),
            SocketAddr::from(([0, 0, 0, 0], 0)),
        ];
        Ok(NetworkState {
            listener: TcpListener::bind(&addrs[..]).await?,
            peers: Mutex::new(vec![]),
        })
    }
}

#[tauri::command]
pub fn get_peers(state: State<'_, NetworkState>) -> Vec<User> {
    info!("Get peers");
    match state.peers.lock() {
        Ok(peers) => peers.to_vec(),
        Err(_) => vec![],
    }
}

#[tauri::command]
pub async fn serve(state: State<'_, NetworkState>) -> Result<()> {
    info!("Serving started");
    // TODO add way to stop accepting connection
    loop {
        let (socket, _) = state.listener.accept().await?;
        let peer = User::new(socket)?;
        // todo add event in ui to ask if you allow a connection
        // NOTE mutex poisoning https://doc.rust-lang.org/std/sync/struct.Mutex.html#examples
        info!("Adding peers {:#?}", peer);
        let mut peers = state.peers.lock().unwrap();
        info!("Peers added");
        peers.push(peer);
    }
}

#[tauri::command]
pub async fn connect(state: State<'_, NetworkState>, address: &str, port: &str) -> Result<User> {
    info!("Connection to {}:{}", address, port);
    let stream = TcpStream::connect(format!("{}:{}", address, port)).await?;
    let peer = User::new(stream)?;
    let b_peer = peer.clone();
    info!("Connecting to peers {:#?}", peer);
    let mut peers = state.peers.lock().unwrap();
    // todo add event in ui to ask for confirmation
    peers.push(peer);
    info!("Peers connected");
    Ok(b_peer)
}

mod test {}
