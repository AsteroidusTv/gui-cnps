use std::fs;
use std::fs::File;
use std::io::Write;
use std::process::Command;
use std::env;

pub fn create_dir(folder: &str) {
    match std::fs::create_dir(folder) {
        Ok(_) => {},
        Err(e) => {
            println!("Error creating folder {:?}: {}", folder, e);
            return;
        }
    }
}

pub fn create_file(file: &str, content: &str) {
    match File::create(&file) {
        Ok(mut file) => {
            if let Err(e) = file.write_all(content.as_bytes()) {
                println!("Error writing to file {}", e);
            } else {
            }
        }
        Err(e) => {
            println!("Error creating file {} : {}", file, e);
        }
    }
}

pub fn simple_create(project_name: &str, extension: &str) {
    let main_folder: String = String::from(project_name.clone());
    let language_file: String = String::from(format!("{}/main.{}", main_folder, extension));

    let str_main_folder = main_folder.as_str();
    let str_language_file = language_file.as_str();

    create_dir(str_main_folder);
    create_file(str_language_file, "");

}

pub fn command_execute(command: &str, args: Vec<&str>) {
    let mut cmd = Command::new(command);
    cmd.args(args);
    
    let output = cmd.output().expect("Failed to execute the command.");

    if !output.status.success() {
        let stderr = String::from_utf8_lossy(&output.stderr);
        println!("Command error: {}", stderr);
    }
}

pub fn change_directory(dir: &str) {
    let documents_dir = env::current_dir().unwrap().join(dir);
    env::set_current_dir(&documents_dir).expect("Imposible to set documents directory");
}

pub fn get_project_subfolders(paths: &str) -> Vec<String>{
    let paths = fs::read_dir(paths).unwrap();
    // Initalize the vector
    let mut in_choices: Vec<String> = Vec::new();

    in_choices.push("NONE".to_string());

    // Push the folder name into the vector.
    for path in paths {
        let entry = path.unwrap();
        let path = entry.path();
        let path_str = path.to_str().unwrap().to_string();
        let path_components: Vec<&str> = path_str.split('/').collect();
        if let Some(last_folder) = path_components.last() {
            in_choices.push(last_folder.to_string());
        }
    };

    in_choices
}