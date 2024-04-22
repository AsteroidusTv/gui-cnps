const { invoke } = window.__TAURI__.core;
const { getCurrent } = window.__TAURI__.window;
const { message } = window.__TAURI__.dialog;


// Get elements from HTML
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
const createPopupButton = document.getElementById("createPopupButton");
const createErrorText = document.getElementById("createErrorText");
const configPopupButton = document.getElementById("configPopupButton");
const configErrorText = document.getElementById("configErrorText");
const checkboxes = document.querySelectorAll('.select-language-installation');


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

createPopupButton.addEventListener("click", () => {
  closePopup("createAlertPopup")
});

configPopupButton.addEventListener("click", () => {
  closePopup("configAlertPopup")
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

// If html is selected has a language, show js selection
function handleSelectChange() {
  if (projectLanguageSelect.value === "html") {
  projectJsBoolDiv.style.display = "flex";
} else {
  projectJsBoolDiv.style.display = "none";
}
}

// Create project
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
    openPopup('createAlertPopup');
    createErrorText.textContent = createError;
  }

}

// Select witch laguages are "installed"
function selectInstalledLanguages() {
  const checkedLanguages = [];

  checkboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkedLanguages.push(checkbox.name.replace('install-', ''));
    }
  });

  return checkedLanguages;
}

// Receive installed languages from rust and add it into a selector
async function getInstallLanguages() {
  const installedLanguages = await invoke("get_installed_languages");
  installedLanguages.forEach((element) => {
    document.querySelector(`input[name="install-${element}"]`).checked = true;
    const option = document.createElement("option");
    option.value = element;
    option.text = element;
    projectLanguageSelect.appendChild(option);
  });
}

// Receive subfolder from rust and add it into a selector
async function getSubfolders() {
  const subfolders = await invoke("get_subfolders");
  subfolders.forEach((element) => {
    const option = document.createElement("option");
    option.value = element;
    option.text = element;
    projectSubfolder.appendChild(option);
  });
}

// Save configuration
async function saveConfiguration() {
  let configError = await invoke("save_configuration", {
    projectFolderPath: projectFolderPathInput.value,
    chosenEditor: chosenEditorSelect.value,
    installedLanguages: selectInstalledLanguages(),
  });
  if (configError == 'none')  {
    location.reload();
  }

  else {
    openPopup('configAlertPopup');
    console.log(selectInstalledLanguages())
    configErrorText.textContent = configError;
  }
  
}

// Toggle configuration/creation
async function configurationCheck() {
  const configBool = await invoke("configuration_check");
  if (configBool) {
    projectCreateForm.style.display = "none";
    configurationForm.style.display = "flex";
  } else {
    getSubfolders();
    getInstallLanguages();
    configurationForm.style.display = "none";
    projectCreateForm.style.display = "flex";
    reconfigButton.addEventListener("click", () => {
      projectCreateForm.style.display = "none";
      configurationForm.style.display = "flex";
      getJsonData();
    });

  }
}

// Get json data from rust 
async function getJsonData() {
  const projectFolderPath = await invoke("send_json_data");
  projectFolderPathInput.value = projectFolderPath;
}

window.addEventListener("DOMContentLoaded", async () => {


  // Call create fuction when create project form is submitted
  projectCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProject();

  });

  // Call config function when config form is submitted
  configurationForm.addEventListener("submit", (e) => {
    e.preventDefault();
    saveConfiguration();
  });

  // Call configuration check function to check if config is done
  configurationCheck();

  // If language selector is changed, call handleSelectChange function
  projectLanguageSelect.addEventListener("change", handleSelectChange);
  
  // Minimise, maximise and close buttons logic
  document
    .getElementById('titlebar-minimize')
    ?.addEventListener('click', () => getCurrent().minimize())
  document
    .getElementById('titlebar-maximize')
    ?.addEventListener('click', () => getCurrent().toggleMaximize());
  document
    .getElementById('titlebar-close')
    ?.addEventListener('click', () => getCurrent().close());
    
});
