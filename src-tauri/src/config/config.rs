use crate::functions::functions;
use serde::{Deserialize, Serialize};
use std::path::PathBuf;

#[derive(Serialize, Deserialize)]
struct Data {
    project_folder_path: String,
    chosen_editor: String,
}

pub fn main(project_folder_path: &str, chosen_editor: &str) -> String {
    let data = Data {
        project_folder_path: project_folder_path.to_string(),
        chosen_editor: chosen_editor.to_string(),
    };

    loop {
        let path_buf = PathBuf::from(&project_folder_path);
        if path_buf.exists() {
            let json_string =
                serde_json::to_string(&data).expect("Failed to serialize data to JSON");
            let file_path = ".data.json";
            functions::create_file(file_path, &json_string);
            break json_string;
        } else {
            return "The folder doesn't exist".to_string();
        }
    }
}