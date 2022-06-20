#[cfg(test)]

mod tests {
    use crate::user::User;
    use crate::network::Adapter;

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
