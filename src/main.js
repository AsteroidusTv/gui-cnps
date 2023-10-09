const { invoke } = window.__TAURI__.tauri;
const { appWindow } = window.__TAURI__.window;

const reconfigButton = document.getElementById("reconfig");
const projectCreateForm = document.getElementById("projectCreate");
const projectNameInput = document.getElementById("projectName");
const projectLanguageSelect = document.getElementById("projectLanguage");
const projectJsCheckbox = document.getElementById("projectJsBool");
const projectJsBoolDiv = document.getElementById("projectJsBoolDiv");
const projectSubfolder = document.getElementById("projectSubfolder");
const projectCreateButton = document.getElementById("projectCreateSubmit");
const configurationForm = document.getElementById("configuration");
const projectFolderPathInput = document.getElementById("projectFolderPath");
const chosenEditorSelect = document.getElementById("chosenEditor");
const projectConfigurationButton = document.getElementById("projectConfigurationButton");
const configErrorText = document.getElementById("configError");

function handleSelectChange() {
  if (projectLanguageSelect.value === "html") {
  projectJsBoolDiv.style.display = "flex";
} else {
  projectJsBoolDiv.style.display = "none";
}
}
 

async function createProject() {
  const debugMessage = await invoke("create_project", {
    projectName: projectNameInput.value,
    projectLanguage: projectLanguageSelect.value,
    includeJs: projectJsCheckbox.checked,
    subfolder: projectSubfolder.value,
  });
  console.log(debugMessage);
}

async function getSubfolders() {
  const subfolders = await invoke("get_subfolders");
  subfolders.forEach((element) => {
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
    configurationForm.style.display = "flex";
  } else {
    configurationForm.style.display = "none";
    projectCreateForm.style.display = "flex";

  }
}

async function reconfiguration() {
  await invoke("reconfiguration");
}
async function getJsonData() {
  const projectFolderPath = await invoke("send_json_data");
  projectFolderPathInput.value = projectFolderPath;
}

window.addEventListener("DOMContentLoaded", () => {
  projectCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProject();

  });

  configurationForm.addEventListener("submit", () => {
    saveConfiguration();
  });

  reconfigButton.addEventListener("click", () => {
    projectCreateForm.style.display = "none";
    configurationForm.style.display = "flex";
    getJsonData();
  });

  projectLanguageSelect.addEventListener("change", handleSelectChange);
  handleSelectChange();

  getSubfolders();
  configurationCheck();

  document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
document
  .getElementById('titlebar-close')
  .addEventListener('click', () => appWindow.close())
});
