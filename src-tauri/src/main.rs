#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::fs::File;
use std::io::Read;

mod languages {
    pub mod assembly;
    pub mod go;
    pub mod html;
    pub mod lua;
    pub mod python;
    pub mod rust;
}

mod functions {
    pub mod functions;
}

mod config {
    pub mod config;
}

#[derive(Serialize, Deserialize)]
struct Data {
    project_folder_path: String,
    chosen_editor: String,
    installed_languages: Vec<String>,
}

#[tauri::command]
fn create_project(
    project_name: &str,
    project_language: &str,
    include_js: bool,
    subfolder: &str,
) -> String {
    let data = read_json(".data.json");
    // Transform json data to str
    let project_folder_path_str = data.project_folder_path.as_str();

    functions::functions::change_directory(project_folder_path_str);

    // Move to the subfolder if chosen
    if subfolder != "NONE" {
        functions::functions::change_directory(project_folder_path_str);
        functions::functions::change_directory(
            format!("{}/{}", project_folder_path_str, subfolder).as_str(),
        );
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
    match project_language {
        "rust" => languages::rust::main(project_name),
        "html" => {
            languages::html::main(project_name, include_js);
            functions::functions::command_execute(open_command, open_args_str);
        }
        "go" => languages::go::main(project_name),
        "python" => languages::python::main(project_name),
        "assembly" => languages::assembly::main(project_name),
        "lua" => languages::lua::main(project_name),
        _ => {} // Other actions are impossible
    }

    // Move to the created directory
    functions::functions::change_directory(project_name);

    // git init + open IDE
    functions::functions::command_execute(git_command, git_args.clone());
    functions::functions::command_execute(editor_command, editor_args.clone());

    // Return debugString
    format!(
        "Project name: {}, Project language: {}, Include js: {}, Subfolder: {}",
        project_name, project_language, include_js, subfolder
    )
}

#[tauri::command]
fn get_installed_languages() -> Vec<std::string::String> {
    let data = read_json(".data.json");
    let installed_languages = data.installed_languages;
    installed_languages
}

#[tauri::command]
fn get_subfolders() -> Vec<String> {
    let data = read_json(".data.json");
    // Transform json data to str
    let project_folder_path_str = data.project_folder_path.as_str();
    let subfolders = functions::functions::get_project_subfolders(project_folder_path_str);

    subfolders
}

#[tauri::command]
fn save_configuration(
    project_folder_path: &str,
    chosen_editor: &str,
    installed_languages: Vec<String>,
) -> String {
    let config_error =
        config::config::main(project_folder_path, chosen_editor, installed_languages);
    config_error
}

#[tauri::command]
fn configuration_check() -> bool {
    if !fs::metadata(".data.json").is_ok() {
        return true;
    } else {
        return false;
    };
}

fn read_json(file: &str) -> Data {
    // Get data from data.json
    let mut file = File::open(file).expect("Failed to open the file.");
    let mut data = String::new();
    file.read_to_string(&mut data)
        .expect("Failed to read the file.");
    let data: Data = serde_json::from_str(&data).expect("Failed to deserialize JSON.");
    data
}

#[tauri::command]
fn send_json_data() -> String {
    let data = read_json(".data.json");
    let project_folder_path_str = data.project_folder_path.as_str();
    project_folder_path_str.to_string()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            create_project,
            get_installed_languages,
            get_subfolders,
            save_configuration,
            configuration_check,
            send_json_data,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
