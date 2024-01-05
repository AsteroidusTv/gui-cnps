use crate::functions::functions;

pub fn main(project_name: &str, with_js: bool) {
    // Nom du dossier que nous voulons créer
    let main_folder: String = String::from(project_name);
    let css_folder: String = String::from(format!("{}/styles", main_folder));
    let js_folder: String = String::from(format!("{}/scripts", main_folder));
    let html_file: String = String::from(format!("{}/index.html", main_folder));
    let css_file: String = String::from(format!("{}/styles/style.css", main_folder));
    let js_file: String = String::from(format!("{}/scripts/script.js", main_folder));
    let html_content = String::from(format!("<!DOCTYPE html>
<html lang='en'>
    <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link rel='stylesheet' type='text/css' href='./styles/style.css'>
    <title>{}</title>
    </head>
    <body>
    </body>
</html>", project_name));
    let html_js_content = String::from(format!("<!DOCTYPE html>
<html lang='en'>
    <head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <link rel='stylesheet' type='text/css' href='./styles/style.css'>
    <script type='text/javascript' src='./scripts/script.js' defer></script>    
    <title>{}</title>
    </head>
    <body>
    </body>
</html>", project_name));
    let css_content = "* {
    margin: 0;
    border: 0;
    padding: 0;
    box-sizing: border-box;
}
";
    let str_main_folder = main_folder.as_str();
    let str_css_folder = css_folder.as_str();
    let str_js_folder = js_folder.as_str();
    let str_html_file = html_file.as_str();
    let str_html_content = html_content.as_str();
    let str_html_js_content = html_js_content.as_str();
    let str_css_file = css_file.as_str();
    let str_js_file = js_file.as_str();

    functions::create_dir(str_main_folder);
    functions::create_dir(str_css_folder);
    functions::create_file(str_html_file, str_html_content);
    functions::create_file(str_css_file, css_content);
    
    if with_js {
        functions::create_dir(str_js_folder);
        functions::create_file(str_html_file, str_html_js_content);
        functions::create_file(str_js_file, "");

    }
}

