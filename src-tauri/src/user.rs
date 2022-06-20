use crate::network::Adapter;

#[derive(serde::Serialize, Clone, Debug)]
pub struct User {
    hostname: String,
    username: String,
    adapter: Vec<Adapter>,
}

impl User {
    pub fn get_hostname() -> String {
        "".to_string()
    }
    pub fn get_username() -> String {
        "".to_string()
    }
    pub fn current() -> User {
        User {
            hostname: User::get_hostname(),
            username: User::get_username(),
            adapter: Adapter::get_adapter_list(),
        }
    }
}
