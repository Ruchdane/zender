// use tauri::api::cli::get_matches;
// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

use std::sync::{Arc, Mutex};

use tokio::spawn;

mod app;
mod commands;
mod error;
mod file;
mod network;
mod user;

#[tokio::main]
async fn main() -> error::Result<()> {
    // Setup logging
    std::env::set_var("RUST_BACKTRACE", "1");
    std::env::set_var("RUST_LOG", "debug");
    env_logger::init();

    // TODO Manage eroor
    // Setup network
    log::info!("Initiating network connection");
    let (mut client, network_event, server) = network::init().await?;

    log::info!("Starting P2Pserver");
    spawn(server.run());

    log::info!("Starting P2Pclient");
    client.start(8677).await?;

    let app = Arc::new(Mutex::new(app::AppState::new()?));
    let app_state = Arc::clone(&app);

    log::info!("Starting TauriP2Pclient");
    spawn(network::client::run(network_event, app));
    log::info!("Building App");

    // Windows
    tauri::Builder::default()
        .setup(|_app| {
            // `main` here is the window label; it is defined on the window creation or under `tauri.conf.json`
            // the default value is `main`. note that it must be unique
            //            let main_window = app.get_window("main").unwrap();
            //      main_window.emit("event-name",payload ).unwrap();
            Ok(())
        })
        .manage(client)
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            commands::who_invoked_you,
            commands::close_splashscreen,
            file::get_sysdata_of_path,
            file::get_metadata_of_path,
            user::get_local_user,
            network::connect,
            network::get_peers,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");

    Ok(())
}
