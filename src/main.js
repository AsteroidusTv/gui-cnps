const { invoke } = window.__TAURI__.tauri;
const projectCreateForm = document.getElementById("projectCreate");
const projectNameInput = document.getElementById("projectName");
const projectLanguageSelect = document.getElementById("projectLanguage");
const projectJsCheckbox = document.getElementById("projectJsBool");
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
  debugText.textContent = await invoke("create_project", {
    projectName: projectNameInput.value, 
    projectLanguage: projectLanguageSelect.value, 
    includeJs: projectJsCheckbox.checked,
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
});

