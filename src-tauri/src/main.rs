#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::Manager;
use std::io;
use std::fs::{self, DirEntry};
use std::path::Path;

struct wmc_path {
    path: String,
    is_dir: bool,
}

fn main() {

   //wmc_read_dir();
   //println!("{:?}", entries);

  tauri::Builder::default()
      .setup(|app| {
            let splashscreen_window = app.get_window("splashscreen").unwrap();
            let main_window = app.get_window("home").unwrap();
            // we perform the initialization code on a new task so the app doesn't freeze
            tauri::async_runtime::spawn(async move {
              // initialize your app here instead of sleeping :)
              println!("Initializing...");
              std::thread::sleep(std::time::Duration::from_millis(1000));
              println!("Done initializing.");

              // After it's done, close the splashscreen and display the main window
              splashscreen_window.close().unwrap();
              main_window.show().unwrap();
            });
            Ok(())
      })
      // ✅ 在这里传递自定义命令
    .invoke_handler(tauri::generate_handler![wmc_read_dir, wmc_write, wmc_read])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn my_read_file(path: std::path::PathBuf) -> String {
    // 读取文件内容，以文本字符串形式返回
    println!("{:?}", path);
    std::fs::read_to_string(path).unwrap()
}

#[tauri::command]
async fn my_read_file_dir(path: std::path::PathBuf)  {
    let  entries = std::fs::read_dir(path)
            //.map(|res| res.map(|e| e.path()))
            .unwrap();

        // The order in which `read_dir` returns entries is not guaranteed. If reproducible
        // ordering is required the entries should be explicitly sorted.

        //entries.sort();
        println!("{:?}", entries);

}

#[tauri::command]
fn wmc_write(path: std::path::PathBuf, content: String) -> bool {
    match fs::write(path, content) {
        Ok(entry) => true,
        Err(e) => false
    }



    /*std::fs::write(path, content)?

    Ok(())*/
}

#[tauri::command]
fn wmc_read(path: std::path::PathBuf) -> String {
    /*match fs::read_to_string("address.txt") {
        Ok(entry) => entry,
        Err(e) => String::from("")
    }*/

    println!("path = {:?}", path);

    if(!path.exists()) {
        return String::from("");
    }

    match fs::read_to_string(path) {
        Ok(entry) => entry,
        Err(error) => String::from("")
    }
}

#[tauri::command]
fn wmc_write_new(path: std::path::PathBuf, content: String) -> std::io::Result<()> {
    std::fs::write(path, content)?;
    Ok(())
}



#[tauri::command]
fn wmc_read_dir(path: std::path::PathBuf) -> String{
    println!("path = {:?}", path);
    let entries = match test(path) {
        Ok(entry) => entry,
        //Err(e) => panic!("Problem creating the file: {:?}", e)
        Err(e) => Vec::new()
    };

    let res = serde_json::to_string(&entries).unwrap();
    println!("{}", res);

    return res;
}
fn test(path: std::path::PathBuf) -> Result<Vec<String>, std::io::Error> {
    let mut entries = std::fs::read_dir(path)?
        .map(|res| res.map(|e| {
        return  e.path().display().to_string() + "," + &e.path().is_dir().to_string();
        }))
        .collect::<Result<Vec<_>, std::io::Error>>()?;

    // The order in which `read_dir` returns entries is not guaranteed. If reproducible
    // ordering is required the entries should be explicitly sorted.

    entries.sort();

    // The entries have now been sorted by their path.
    //println!("{:?}", entries);
    Ok(entries)
}
