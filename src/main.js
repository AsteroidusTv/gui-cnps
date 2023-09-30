
const { invoke } = window.__TAURI__.tauri;

// Create project variables
const projectCreateForm = document.getElementById("projectCreate");
const projectNameInput = document.getElementById("projectName");
const projectLanguageSelect = document.getElementById("projectLanguage");
const projectJsCheckbox = document.getElementById("projectJsBool");
const projectSubfolder = document.getElementById("projectSubfolder");
const projectCreateButton = document.getElementById("projectCreateSubmit");
// Configuration variables
const configurationForm = document.getElementById("configuration")
const projectFolderPathInput = document.getElementById("projectFolderPath");
const chosenEditorSelect = document.getElementById("chosenEditor");
const projectConfigurationButton = document.getElementById("projectConfigurationButton");
const configErrorText = document.getElementById("configError");


// Debug
const debugText = document.getElementById("debugText");

document.onkeydown = (e) => {
  if (e.key == 123) {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'I') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'C') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.shiftKey && e.key == 'J') {
      e.preventDefault();
  }
  if (e.ctrlKey && e.key == 'U') {
      e.preventDefault();
  }
};

function handleSelectChange() {
  if (projectLanguageSelect.value === "html") {
    projectJsCheckbox.style.display = "block";
  } else {
    projectJsCheckbox.style.display = "none";
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

  // Set text to debug message
  debugText.textContent = debugMessage;
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
  } else {
    configurationForm.style.display = "none";
  }

}



window.addEventListener("DOMContentLoaded", () => {
  projectCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProject();
  });

  configurationForm.addEventListener("submit", (e) => {
    saveConfiguration()
  });


  // Show/Hide checkbox 
  projectLanguageSelect.addEventListener("change", handleSelectChange);
  handleSelectChange()
  getSubfolders()
  configurationCheck()
});



