#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

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


#[tauri::command]
fn create_project(project_name: &str, project_language: &str, include_js: bool,) -> String {

    // Command variables and arguments to execute
    let git_command: &str = "git";
    let git_args = vec!["init"];
    let editor_command = "code"; // Need to config that later
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
    format!("Project name: {}, Project language: {}, Include js: {}", project_name, project_language, include_js)
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![create_project])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
