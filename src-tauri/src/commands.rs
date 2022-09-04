use log::info;
use tauri::Manager;

#[tauri::command]
pub fn who_invoked_you(invoker: String) {
  println!("I was invoked from {}!", invoker);
}

// Create the command:
// This command must be async so that it doesn't run on the main thread.
#[tauri::command]
pub async fn close_splashscreen(window: tauri::Window) {
    info!("Close splashscreen");
  // Close splashscreen
  if let Some(splashscreen) = window.get_window("splashscreen") {
    splashscreen.close().unwrap();
  }
  // Show main window
  window.get_window("main").unwrap().show().unwrap();
}
