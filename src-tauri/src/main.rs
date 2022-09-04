// use tauri::api::cli::get_matches;
// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

use log::info;

mod commands;
mod error;
mod file;
mod network;
mod user;

#[tokio::main]
async fn main() -> error::Result<()> {
    // Parse arg
    // let context = tauri::generate_context!();
    // let quit = CustomMenuItem::new("quit".to_string(), "Quit");
    // let close = CustomMenuItem::new("close".to_string(), "Close");
    // let submenu = Submenu::new("File", Menu::new().add_item(quit).add_item(close));
    // let menu = Menu::new()
    //   .add_native_item(MenuItem::Copy)
    //   .add_item(CustomMenuItem::new("hide", "Hide"))
    //   .add_submenu(submenu);
    // let cli_config = context.config().tauri.cli.clone().unwrap();
    // match get_matches(&cli_config,context.package_info()) {
    //   Ok(matches) => {
    //     println!("{:?}", matches)
    //   }
    //   Err(_) => {}
    // };

    // Setup logging
    std::env::set_var("RUST_BACKTRACE", "1");
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    // Setup network
    info!("Initiating network connection");
    let network_state = network::NetworkState::init(8677).await?;
    info!(
        "Network connection initiated : {:#?}",
        network_state.listener
    );
    // Windows
    tauri::Builder::default()
        // .menu(menu)
        .manage(network_state)
        .invoke_handler(tauri::generate_handler![
            commands::close_splashscreen,
            file::get_sysdata_of_path,
            file::get_metadata_of_path,
            user::get_local_user,
            network::serve,
            network::connect,
            network::get_peers,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
    Ok(())
}
