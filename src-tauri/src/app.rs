use crate::{error::Result, user::User};

pub struct AppState {
    user: User,
    peers: Vec<User>,
}

impl AppState {
    pub fn new() -> Result<Self> {
        Ok(Self {
            user: User::current()?,
            peers: vec![],
        })
    }

    pub fn add_addr(&mut self, addr: String) {
        self.user.addreses.push(addr);
    }
}
