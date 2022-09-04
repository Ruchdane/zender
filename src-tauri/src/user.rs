use crate::network::Adapter;
use schemars::JsonSchema;
use tokio::net::TcpStream;

use crate::error::Result;

#[derive(serde::Serialize, Clone, Debug, JsonSchema)]
pub struct User {
    hostname: String,
    username: String,
    adapter: Vec<Adapter>,
}

// Is it necessary to write test ?
impl User {
    pub fn current() -> User {
        User {
            hostname: whoami::hostname(),
            username: whoami::username(),
            adapter: Adapter::get_adapter_list(),
        }
    }

    pub fn new(socket: TcpStream) -> Result<User> {
        todo!()
    }
}

#[tauri::command]
pub async fn get_local_user() -> User {
    User::current()
}
