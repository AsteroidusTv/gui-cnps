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
const popupButton = document.getElementById("popupButton");
const createErrorText = document.getElementById("createErrorText");


// Popups logic

function openPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.add("show");
}

function closePopup(id) {
  const popup = document.getElementById(id);
  popup.classList.add("closing");
  setTimeout(() => {
      popup.classList.remove("show", "closing");
  }, 250);
}

popupButton.addEventListener("click", () => {
  closePopup("alertPopup")
});

document.addEventListener("keydown", function (event) {
if (event.key === "Escape") {
  const changeProfilePicturePopup = document.getElementById("changeProfilePicturePopup");
  if (changeProfilePicturePopup.classList.contains("show")) {
    closePopup("changeProfilePicturePopup");
  } else {
    const popups = document.querySelectorAll(".show");
    popups.forEach(function (popup) {
      closePopup(popup.id);
    });
  }
}
});



function handleSelectChange() {
  if (projectLanguageSelect.value === "html") {
  projectJsBoolDiv.style.display = "flex";
} else {
  projectJsBoolDiv.style.display = "none";
}
}

async function createProject() {
  
  if (projectLanguageSelect.value !== "NONE" && projectSubfolder.value !== "none") {
  await invoke("create_project", {
      projectName: projectNameInput.value,
      projectLanguage: projectLanguageSelect.value,
      includeJs: projectJsCheckbox.checked,
      subfolder: projectSubfolder.value,
    });
  }
  
  else {

    let createError = "None"

    if (projectLanguageSelect.value == "NONE") {
      createError = "You need to choose a language for your project !";
    }

    else if (projectSubfolder.value == "none") {
      createError = "You must choose 'NONE' or a subfolder for your project";
    }

    else {
      createError = "You must choose 'NONE' or a subfolder and a language for your project";
    }
    openPopup('alertPopup');
    createErrorText.textContent = createError;
  }

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
    getSubfolders();
    configurationForm.style.display = "none";
    projectCreateForm.style.display = "flex";
    reconfigButton.addEventListener("click", () => {
      projectCreateForm.style.display = "none";
      configurationForm.style.display = "flex";
      getJsonData();
    });

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

  projectLanguageSelect.addEventListener("change", handleSelectChange);
  handleSelectChange();

  configurationCheck();
  
  document
  .getElementById('titlebar-minimize')
  .addEventListener('click', () => appWindow.minimize())
  document
    .getElementById('titlebar-maximize')
    .addEventListener('click', () => appWindow.toggleMaximize())
  document
    .getElementById('titlebar-close')
    .addEventListener('click', () => appWindow.close())
});
