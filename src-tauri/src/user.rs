use std::sync::{Arc, Mutex};

use schemars::JsonSchema;
use serde::{Deserialize, Serialize};
use tauri::State;

use crate::error::Result;

#[derive(Serialize, Deserialize, Clone, Debug, JsonSchema)]
pub struct User {
    hostname: String,
    username: String,
    pub addreses: Vec<String>,
}

// Is it necessary to write test ?
impl User {
    pub fn current() -> Result<User> {
        Ok(User {
            hostname: whoami::hostname(),
            username: whoami::username(),
            addreses: vec![],
        })
    }

    pub fn title(&self) -> String {
        format!("{}@{}", self.hostname, self.username)
    }
}

#[tauri::command]
pub async fn get_local_user(user: State<'_, Arc<Mutex<User>>>) -> Result<User> {
    Ok(user.lock().unwrap().clone())
}
