use std::io;

use futures::prelude::*;
use libp2p::{swarm::SwarmEvent, Swarm};
use tokio::sync::mpsc;

use crate::error::Error;

use super::behaviour::{Behaviour, Event as BehaviourEvent};
use super::{Command, Event, Result};

pub struct Server {
    swarm: Swarm<Behaviour>,
    command_receiver: mpsc::Receiver<Command>,
    event_sender: mpsc::Sender<Event>,
}

impl Server {
    pub fn new(
        swarm: Swarm<Behaviour>,
        command_receiver: mpsc::Receiver<Command>,
        event_sender: mpsc::Sender<Event>,
    ) -> Self {
        Self {
            swarm,
            command_receiver,
            event_sender,
        }
    }

    pub async fn run(mut self) {
        loop {
            tokio::select! {
                event = self.swarm.next() => self.handle_event(event.expect("Swarm stream to be infinite.")).await,
                command = self.command_receiver.recv() => match command {
                    Some(c) => self.handle_command(c).await,
                    // Command channel closed, thus shutting down the network event loop.
                    None=>  return,
                },
            }
        }
    }
    async fn handle_event(&mut self, event: SwarmEvent<BehaviourEvent, io::Error>) {
        match event {
            SwarmEvent::Behaviour(_) => todo!(),
            SwarmEvent::ConnectionEstablished { .. } => todo!(),
            SwarmEvent::ConnectionClosed { .. } => todo!(),
            SwarmEvent::IncomingConnection { .. } => todo!(),
            SwarmEvent::IncomingConnectionError { .. } => todo!(),
            SwarmEvent::OutgoingConnectionError { .. } => todo!(),
            SwarmEvent::BannedPeer { .. } => todo!(),
            SwarmEvent::ExpiredListenAddr { .. } => todo!(),
            SwarmEvent::ListenerClosed { .. } => todo!(),
            SwarmEvent::ListenerError { .. } => todo!(),
            SwarmEvent::Dialing(_) => todo!(),
            SwarmEvent::NewListenAddr {
                listener_id: _,
                address: addr,
            } => {
                log::info!("listening on {}", addr);
                self.event_sender
                    .send(Event::NewListenAddr(addr.to_string()))
                    .await
                    .expect("Event to not be dropped");
            }
        }
    }
    async fn handle_command(&mut self, comand: Command) {
        match comand {
            Command::Dial {
                peer_id: _,
                peer_addr,
                sender: _,
            } => {
                log::info!("Dialing : {}", peer_addr);
                self.swarm.dial(peer_addr).unwrap();
            }
            Command::StartListening { addr, sender } => {
                log::info!("StartListening");
                if self.swarm.listen_on(addr).is_err() {
                    let res = self.swarm.listen_on("/ip4/0.0.0.0/tcp/0".parse().unwrap());
                    let _ = match res {
                        Ok(_) => sender.send(Ok(())),
                        Err(e) => sender.send(Err(Error::from(e))),
                    };
                } else {
                    sender.send(Ok(()));
                }
            }
            Command::StartProviding {
                file_name,
                sender: _,
            } => todo!(),
            Command::GetProviders { file_name, sender } => todo!(),
            Command::RequestFile {
                file_name,
                peer,
                sender,
            } => todo!(),
            Command::RespondFile { file, channel } => todo!(),
            //            {
            //              Err(e) => sender.send(Error::from(Err(e))),
            //              Ok(e) => {}
            //          },
        }
    }
}
