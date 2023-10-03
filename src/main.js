
const { invoke } = window.__TAURI__.tauri;

// Reconfiguration
const reconfigButton = document.getElementById("reconfig");
// Create project variables
const projectCreateForm = document.getElementById("projectCreate");
const projectNameInput = document.getElementById("projectName");
const projectLanguageSelect = document.getElementById("projectLanguage");
const projectJsCheckbox = document.getElementById("projectJsBool");
const projectJsTextLabel = document.getElementById("projectJsText");
const projectSubfolder = document.getElementById("projectSubfolder");
const projectCreateButton = document.getElementById("projectCreateSubmit");
// Configuration variables
const configurationForm = document.getElementById("configuration")
const projectFolderPathInput = document.getElementById("projectFolderPath");
const chosenEditorSelect = document.getElementById("chosenEditor");
const projectConfigurationButton = document.getElementById("projectConfigurationButton");
const configErrorText = document.getElementById("configError");




function handleSelectChange() {
  if (projectLanguageSelect.value === "html") {
    projectJsCheckbox.style.display = "block";
    projectJsTextLabel.style.display = "block";
  } else {
    projectJsCheckbox.style.display = "none";
    projectJsTextLabel.style.display = "none";
  }
}


async function createProject() {
  // Get returns from rust
  const debugMessage = await invoke("create_project", {
    projectName: projectNameInput.value, 
    projectLanguage: projectLanguageSelect.value, 
    includeJs: projectJsCheckbox.checked,
    subfolder: projectSubfolder.value,
  });

  console.log(debugMessage)
}

async function getSubfolders() {
  const subfolders = await invoke("get_subfolders")
  // Put subfolders into selector
  subfolders.forEach(element => {
    const option = document.createElement("option");
    option.value = element;
    option.text = element; 
    projectSubfolder.appendChild(option);
  });
}

async function saveConfiguration() {
  const configErrorMessage = await invoke("save_configuration", {
    projectFolderPath: projectFolderPathInput.value,
    chosenEditor: chosenEditorSelect.value,
  });

  configErrorText.textContent = configErrorMessage;
}

async function configurationCheck() {
  const configBool = await invoke("configuration_check");

  if (configBool) {
    projectCreateForm.style.display = "none";
    reconfigButton.style.display = "none";
  } else {
    configurationForm.style.display = "none";
  }

}

async function reconfiguration() {
  await invoke("reconfiguration");
}

async function get_json_data() {
  const projectFolderPath = await invoke("send_json_data");
  projectFolderPathInput.value = projectFolderPath;
}


window.addEventListener("DOMContentLoaded", () => {
  projectCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProject();
  });

  configurationForm.addEventListener("submit", (e) => {
    saveConfiguration()
  });

  reconfigButton.addEventListener("click", (e) =>{
    projectCreateForm.style.display = "none";
    reconfigButton.style.display = "none";
    configurationForm.style.display = "flex"
    get_json_data()
  });

  // onclick.reconfigButton = function() {}
  // Show/Hide checkbox 
  projectLanguageSelect.addEventListener("change", handleSelectChange);
  handleSelectChange()
  getSubfolders()
  configurationCheck()
});



