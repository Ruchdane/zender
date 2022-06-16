// use tauri::api::cli::get_matches;
// use tauri::{CustomMenuItem, Menu, MenuItem, Submenu};

mod commands;
mod file;
mod tests;

fn main() {
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
  tauri::Builder::default()
    // .menu(menu)
    .invoke_handler(tauri::generate_handler![
      commands::who_invoked_you,
      commands::close_splashscreen,
      file::get_file_metadata
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
