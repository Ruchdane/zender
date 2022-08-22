use serde::Serialize;
#[derive(Serialize, Clone, Debug)]
pub struct Adapter {
    adapter: String,
    addresses: String,
}

impl Adapter {
    pub fn get_adapter_list() -> Vec<Adapter> {
        return vec![Adapter {
            adapter: "".to_string(),
            addresses: "".to_string(),
        }];
    }
}

