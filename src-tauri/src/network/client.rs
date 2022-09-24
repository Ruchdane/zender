use std::sync::{Arc, Mutex};

use libp2p::{Multiaddr, PeerId};
use tokio::sync::{mpsc, oneshot};

use crate::{app::AppState, error::Result};
// use crate::user::User;

use super::{Command, Event};

pub struct Client {
    /// Command sender
    sender: mpsc::Sender<Command>,
}
impl Client {
    pub fn new(sender: mpsc::Sender<Command>) -> Self {
        Self { sender }
    }

    /// Listen for incoming connections on the given address.
    pub async fn start(&mut self, port: u16) -> Result<()> {
        log::info!("P2PClient starting");
        let (sender, receiver) = oneshot::channel();
        self.sender
            .send(Command::StartListening {
                addr: format!("/ip4/0.0.0.0/tcp/{}", port).to_string().parse()?,
                sender,
            })
            .await
            .expect("Command receiver not to be dropped.");
        log::info!("command sent");
        receiver.await.expect("Sender not to be dropped.")
    }
    pub async fn dial(&self, peer_id: PeerId, peer_addr: Multiaddr) -> Result<()> {
        let (sender, receiver) = oneshot::channel();
        self.sender
            .send(Command::Dial {
                peer_id,
                peer_addr,
                sender,
            })
            .await
            .expect("Command receiver not to be dropped.");
        receiver.await.expect("Sender not to be dropped.")
    }
}

pub async fn run(mut receiver: mpsc::Receiver<Event>, user: Arc<Mutex<AppState>>) {
    loop {
        match receiver.recv().await {
            Some(e) => handle_event(e, &user).await,
            None => return,
        }
    }
}

async fn handle_event(e: Event, state: &Mutex<AppState>) {
    match e {
        Event::Dial => todo!(),
        Event::NewListenAddr(addr) => {
            state
                .lock()
                .expect("Expect mutex to not be poisonned")
                .add_addr(addr);
        }
    };
}
