const { invoke } = window.__TAURI__.tauri;
const projectCreateForm = document.getElementById("projectCreate");
const projectNameInput = document.getElementById("projectName");
const projectLanguageSelect = document.getElementById("projectLanguage");
const projectJsCheckbox = document.getElementById("projectJsBool");
const projectSubfolder = document.getElementById("projectSubfolder");
const projectCreateButton = document.getElementById("projectCreateSubmit");

// Debug
const debugText = document.getElementById("debugText");


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

window.addEventListener("DOMContentLoaded", () => {
  projectCreateForm.addEventListener("submit", (e) => {
    e.preventDefault();
    createProject();
  });

  // Show/Hide checkbox 
  projectLanguageSelect.addEventListener("change", handleSelectChange);
  handleSelectChange()
  getSubfolders()
});

