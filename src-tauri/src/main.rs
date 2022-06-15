use tauri::api::cli::get_matches;

#[tauri::command]
fn my_custom_command() {
  println!("I was invoked from JS!");
}

fn main() {
  let context = tauri::generate_context!();
  let cli_config = context.config().tauri.cli.clone().unwrap();
  match get_matches(&cli_config,context.package_info()) {
    Ok(matches) => {
      println!("{:?}", matches)
    }
    Err(_) => {}
  };
  tauri::Builder::default()
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}