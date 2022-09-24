use std::collections::HashSet;

use libp2p::identify::{Identify, IdentifyConfig};
use libp2p::identity::Keypair;
use libp2p::request_response::ResponseChannel;
use libp2p::{Multiaddr, PeerId, Swarm};
use log::info;
use tauri::async_runtime::Receiver;
use tokio::sync::{mpsc, oneshot};

use self::client::Client;
use self::file::FileResponse;
use self::server::Server;
use crate::error::Result;
use crate::user::User;

pub mod behaviour;
pub mod client;
mod file;
pub mod server;

#[derive(Debug)]
pub enum Command {
    StartListening {
        addr: Multiaddr,
        sender: oneshot::Sender<Result<()>>,
    },
    Dial {
        peer_id: PeerId,
        peer_addr: Multiaddr,
        sender: oneshot::Sender<Result<()>>,
    },
    StartProviding {
        file_name: String,
        sender: oneshot::Sender<()>,
    },
    GetProviders {
        file_name: String,
        sender: oneshot::Sender<HashSet<PeerId>>,
    },
    RequestFile {
        file_name: String,
        peer: PeerId,
        sender: oneshot::Sender<Result<Vec<u8>>>,
    },
    RespondFile {
        file: Vec<u8>,
        channel: ResponseChannel<FileResponse>,
    },
}

#[derive(Debug)]
pub enum Event {
    Dial,
    NewListenAddr(String),
}
pub async fn init() -> Result<(Client, Receiver<Event>, Server)> {
    // Search for the advantage of using a seed
    let key = Keypair::generate_ed25519();
    let swarm = Swarm::new(
        libp2p::development_transport(key.clone()).await?,
        behaviour::Behaviour::new(Identify::new(IdentifyConfig::new(
            "ipfs/1.0.0".to_string(),
            key.public(),
        ))),
        key.public().to_peer_id(),
    );
    let (command_sender, command_receiver) = mpsc::channel(1);
    let (event_sender, event_receiver) = mpsc::channel(1);
    Ok((
        Client::new(command_sender),
        event_receiver,
        Server::new(swarm, command_receiver, event_sender),
    ))
}
// pub async fn init(port: u16) -> Resulth> {
//    let addrs = [
//        SocketAddr::from(([0, 0, 0, 0], port)),
//        SocketAddr::from(([0, 0, 0, 0], 0)),
//    ];
//
//    let key = Keypair::generate_ed25519();
//    let id = PeerId::from(key.public());
//    let transport = libp2p::development_transport(key.clone()).await?;
//    let behaviour = behaviour::Behaviour::new(Identify::new(IdentifyConfig::new(
//        "ipfs/1.0.0".to_string(),
//        key.public(),
//    )));
//    let swarm = Swarm::new(transport, behaviour, id);
//    Ok(NetworkState {
//        key,
//        swarm: Mutex::new(swarm),
//        peers: Mutex::new(vec![]),
//    })
// }

#[tauri::command]
pub fn get_peers() -> Vec<User> {
    info!("Get peers");
    todo!();
}

/// Wraper for client connection request
#[tauri::command]
pub async fn connect(address: &str, port: u16) -> Result<User> {
    let addr: Multiaddr = format!("ip4/{}/tcp/{}", address, port).parse()?;
    todo!()
}
