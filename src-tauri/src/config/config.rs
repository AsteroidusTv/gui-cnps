use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use crate::functions::functions;



#[derive(Serialize, Deserialize)]
struct Data {
    projects_path: String, 
    editor_choice: String, 
}

pub fn main(editor_choice: &str, projects_path: &str) -> String {
    let data = Data {
        projects_path: projects_path.to_string(), 
        editor_choice: editor_choice.to_string(), 
    };

    loop {
        let path_buf = PathBuf::from(&projects_path);
        if path_buf.exists() {
            let json_string = serde_json::to_string(&data).expect("Failed to serialize data to JSON");
            let file_path = ".data.json";
            functions::create_file(file_path, &json_string);
            break json_string
        } else {
            return "The folder doesn't exist".to_string()
        }
    }

}

