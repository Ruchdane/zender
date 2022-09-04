extern crate pnet;
use std::sync::Mutex;

use pnet_datalink::interfaces;
use schemars::JsonSchema;
use serde::Serialize;
use tauri::State;
use tokio::net::{TcpListener, TcpStream};

use crate::error::Result;
use crate::user::User;

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
    listener: TcpListener,
    peers: Mutex<Vec<User>>,
}

impl NetworkState {
    pub async fn init(addr: &str, port: &str) -> Result<NetworkState> {
        Ok(NetworkState {
            listener: TcpListener::bind(format!("{}:{}", addr, port)).await?,
            peers: Mutex::new(vec![]),
        })
    }
}

#[tauri::command]
pub fn get_peers(state: State<'_, NetworkState>) -> Vec<User> {
    match state.peers.lock() {
        Ok(peers) => peers.to_vec(),
        Err(_) => vec![],
    }
}

#[tauri::command]
pub async fn serve(state: State<'_, NetworkState>) -> Result<()> {
    loop {
        let (socket, _) = state.listener.accept().await?;
        let peer = User::new(socket)?;
        // todo add event in ui to ask if you allow a connection
        // NOTE mutex poisoning https://doc.rust-lang.org/std/sync/struct.Mutex.html#examples
        let mut peers = state.peers.lock().unwrap();
        peers.push(peer);
    }
}

#[tauri::command]
pub async fn connect(state: State<'_, NetworkState>, address: &str, port: &str) -> Result<User> {
    let stream = TcpStream::connect(format!("{}:{}", address, port)).await?;
    let peer = User::new(stream)?;
    let b_peer = peer.clone();
    let mut peers = state.peers.lock().unwrap();
    // todo add event in ui to ask for confirmation
    peers.push(peer);
    Ok(b_peer)
}

mod test {
    use super::Adapter;
    #[test]
    fn all_specified_addresse_ar_not_null() {
        //TODO compare the interface found with thos givee by interface
        for adp in Adapter::get_adapter_list() {
            for ip in adp.ips {
                assert!(ip.start_with("0"));
            }
        }
    }
}
