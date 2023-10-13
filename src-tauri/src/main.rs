#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use std::fs::File;
use std::io::Read;
use std::path::PathBuf;
use serde::{Serialize, Deserialize};

mod languages {
    pub mod html;
    pub mod rust;
    pub mod go;
    pub mod python;
    pub mod assembly;
    pub mod lua;
}

mod functions {
    pub mod functions;
}

mod config {
    pub mod config;
}

#[derive(Serialize, Deserialize)]
struct Data {
    project_folder_path: PathBuf,
    chosen_editor: String,
}

#[tauri::command]
fn create_project(project_name: &str, project_language: &str, include_js: bool, subfolder: &str) -> String{

    let data = read_json(".data.json");
    // Transform json data to str
    let project_folder_path_str = data.project_folder_path.to_str().unwrap_or("default_folder_path");
    functions::functions::change_directory(project_folder_path_str);

    // Move to the subfolder if chosen
    if subfolder != "NONE" {
        functions::functions::change_directory(project_folder_path_str);
        functions::functions::change_directory(format!("{}/{}", project_folder_path_str, subfolder).as_str());
    }

    // Command variables and arguments to execute
    let git_command: &str = "git";
    let git_args = vec!["init"];
    let editor_command = data.chosen_editor.as_str();
    let editor_args = vec!["."];
    let open_command = "open";
    let open_args = vec![format!("{}/index.html", project_name)];
    let open_args_str: Vec<&str> = open_args.iter().map(|arg| arg.as_str()).collect();
    
    // Create project files in different languages.
    if project_language == "rust" {
        languages::rust::main(project_name);
    } else if project_language == "html" {
        languages::html::main(project_name, include_js);
        functions::functions::command_execute(open_command, open_args_str);
    } else if project_language == "go" {
        languages::go::main(project_name);
    } else if project_language == "python"  {
        languages::python::main(project_name);
    } else if project_language == "assembly" {
        languages::assembly::main(project_name);
    } else if project_language == "lua" {
        languages::lua::main(project_name);
    }

    // Move to the created directory
    functions::functions::change_directory(project_name);

    // git init + open IDE
    functions::functions::command_execute(git_command, git_args.clone());
    functions::functions::command_execute(editor_command, editor_args.clone());

    // Return debugString
    format!("Project name: {}, Project language: {}, Include js: {}, Subfolder: {}", project_name, project_language, include_js, subfolder)
}

#[tauri::command]
fn get_subfolders() -> Vec<String> {
    let data = read_json(".data.json");
    // Transform json data to str
    let project_folder_path_str = data.project_folder_path.to_str().unwrap_or("default_folder_path");
    let subfolders = functions::functions::get_project_subfolders(project_folder_path_str);

    subfolders
}
#[tauri::command]
fn save_configuration(project_folder_path: &str, chosen_editor: &str) -> String {
    let config_eror = config::config::main(project_folder_path, chosen_editor);
    
    format!("Error: {}", config_eror)
}

#[tauri::command]
fn configuration_check() -> bool{
    if !fs::metadata(".data.json").is_ok() {
        return true
    } else {
        return false;
    };
}

fn read_json(file: &str) -> Data {
    // Get data from data.json
    let mut file = File::open(file).expect("Failed to open the file.");
    let mut data = String::new();
    file.read_to_string(&mut data).expect("Failed to read the file.");
    let data: Data = serde_json::from_str(&data).expect("Failed to deserialize JSON.");
    data
}

#[tauri::command]
fn send_json_data() -> String {
    let data = read_json(".data.json");
    let project_folder_path_str = data.project_folder_path.to_str().unwrap_or("default_folder_path");
    project_folder_path_str.to_string()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_project, get_subfolders, save_configuration, configuration_check, send_json_data])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
