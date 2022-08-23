use crate::network::Adapter;

#[derive(serde::Serialize, Clone, Debug)]
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
}

#[tauri::command]
pub async fn get_local_user() -> User {
    User::current()
}
