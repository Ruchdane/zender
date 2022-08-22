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

#[cfg(test)]
mod test {
    use super::*;

    #[test]
    fn username_is_correct() {
        assert_eq!(User::get_username(), "ruchdane".to_string());
    }
    #[test]
    fn hostname_is_correct() {
        assert_eq!(User::get_hostname(), "origin".to_string());
    }
    #[test]
    fn adapter_list_is_correct() {
        let _adapters = Adapter::get_adapter_list();
        // TODO Verifier que les interfaces sont corrects
    }
}
