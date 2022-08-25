use pnet_datalink::interfaces;
use serde::Serialize;
#[derive(Serialize, Clone, Debug)]
pub struct Adapter {
    pub name: String,
    pub description: String,
    index: u32,
    pub ips: Vec<String>,
}

impl Adapter {
    pub fn get_adapter_list() -> Vec<Adapter> {
        interfaces()
            .iter()
            .map(|interface| Adapter {
                name: interface.name.clone(),
                description: interface.description.clone(),
                index: interface.index,
                ips: interface.ips.iter().map(|ip| ip.to_string()).collect(),
            })
            .collect()
    }
}
mod test {
    use super::*;
    #[test]
    fn hello() {
        //TODO compare the interface found with thos givee by interface
        for iface in interfaces() {
            todo!();
        }
    }
}
