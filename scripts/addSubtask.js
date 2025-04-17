const subtasks = [];
const subInput = document.getElementById("subtask-input");
const addIcon = document.getElementById("add-icon");
const checkIcon = document.getElementById("check-subtask-icon");
const closeIcon = document.getElementById("close-subtask-icon");
const listContainer = document.getElementById("subtask-list");
const seperator = document.getElementById("seperator");

/**
 * Initializes the subtask user interface by clearing the input field
 * and toggling the visibility of icons.
 *
 * @function
 */
function initSubtaskUI() {
  const inputField = document.querySelector("#subtasks input");
  if (inputField) {
    inputField.value = ""; // Nur ausführen, wenn das Element existiert
  } else {
    console.error("Element #subtasks input nicht gefunden");
  }
  toggleIcons(false);
}

/**
 * Toggles the visibility of specific icons based on the provided state.
 *
 * @param {boolean} isActive - Determines the visibility of the icons.
 *                              If true, the `addIcon` is hidden and the `checkIcon`, `closeIcon`, and `seperator` are shown.
 *                              If false, the `addIcon` is shown and the `checkIcon`, `closeIcon`, and `seperator` are hidden.
 */
function toggleIcons(isActive) {
  addIcon.classList.toggle("d-none", isActive);
  checkIcon.classList.toggle("d-none", !isActive);
  closeIcon.classList.toggle("d-none", !isActive);
  seperator.classList.toggle("d-none", !isActive);
}

/**
 * Activates the subtask input field by setting its value, toggling icons, and focusing on the input.
 * 
 * @function
 * @description This function sets the value of the subtask input field to "Contact Form",
 *              displays the appropriate icons by toggling their visibility, and focuses
 *              on the input field to allow user interaction.
 */
function activateSubtaskInput() {
  subInput.value = "Contact Form";
  subInput.style.color = "#000000";
  toggleIcons(true);
  subInput.focus();
}

function cancelSubtaskEntry() {
  initSubtaskUI();
}

function confirmSubtaskEntry() {
  const val = subInput.value.trim();
  if (val) {
    subtasks.push({ name: val });
    updateSubtaskList();
  }
  initSubtaskUI();
}

function updateSubtaskList() {
  listContainer.innerHTML = "";
  for (let i = 0; i < subtasks.length; i++) {
    listContainer.innerHTML += subtasksTemplate(subtasks[i], i);
  }
}

function editSubtask(index) {
  const subtaskItem = document.querySelectorAll(".subtask-item")[index];
  const subtaskText = subtaskItem.querySelector(".subtask-text");
  const subtaskIcons = subtaskItem.querySelector(".subtask-icons");

  subtaskItem.classList.add("editing");
  subtaskText.innerHTML = `<input type="text" class="edit-input" value="${subtasks[index].name}" onkeypress="handleEditKeyPress(event, ${index})">`;
  subtaskIcons.innerHTML = `
    <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
    <img src="../images/checkDark.svg" alt="Save" class="subtask-icon save-icon" onclick="saveSubtask(${index})">
  `;
  subtaskText.querySelector(".edit-input").focus();
}

function saveSubtask(index) {
  const input = document.querySelector(".edit-input");
  const newValue = input.value.trim();
  if (newValue) {
    subtasks[index].name = newValue;
    updateSubtaskList();
  }
}

function handleEditKeyPress(event, index) {
  if (event.key === "Enter") {
    saveSubtask(index);
  }
}

function deleteSubtask(index) {
  subtasks.splice(index, 1);
  updateSubtaskList();
}

function setupSubtaskListeners() {
  addIcon.addEventListener("click", activateSubtaskInput);
  closeIcon.addEventListener("click", cancelSubtaskEntry);
  checkIcon.addEventListener("click", confirmSubtaskEntry);
  subInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      confirmSubtaskEntry();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initSubtaskUI();
  setupSubtaskListeners();
});
