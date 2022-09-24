use libp2p::{
    identify::{Identify, IdentifyEvent},
    NetworkBehaviour,
};

#[derive(NetworkBehaviour)]
#[behaviour(out_event = "Event")]
pub struct Behaviour {
    identify: Identify,
}

impl Behaviour {
    pub fn new(identify: Identify) -> Self {
        Self { identify }
    }
}

pub enum Event {
    Identify(IdentifyEvent),
}

impl From<IdentifyEvent> for Event {
    fn from(event: IdentifyEvent) -> Self {
        Self::Identify(event)
    }
}
