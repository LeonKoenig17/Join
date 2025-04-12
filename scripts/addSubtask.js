const subtasks = [];
const subInput = document.getElementById("subtask-input");
const addIcon = document.getElementById("add-icon");
const checkIcon = document.getElementById("check-subtask-icon");
const closeIcon = document.getElementById("close-subtask-icon");
const listContainer = document.getElementById("subtask-list");
const seperator = document.getElementById("seperator");

function initSubtaskUI() {
  subInput.value = "";
  addIcon.classList.remove("d-none");
  checkIcon.classList.add("d-none");
  closeIcon.classList.add("d-none");
}

function activateSubtaskInput() {
  subInput.value = "Contact Form";
  addIcon.classList.add("d-none");
  checkIcon.classList.remove("d-none");
  closeIcon.classList.remove("d-none");
  seperator.classList.remove("d-none");
  subInput.focus();
}

function cancelSubtaskEntry() {
  initSubtaskUI();
}

function confirmSubtaskEntry() {
  const val = subInput.value.trim();
  if (val !== "") {
  
    subtasks.push({ name: val });
    updateSubtaskList();
  }
  initSubtaskUI();
}

function updateSubtaskList() {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    html += subtasksTemplate(subtasks[i], i);
  }
  listContainer.innerHTML = html;
}

function editSubtask(index) {
  const subtaskItem = document.querySelectorAll(".subtask-item")[index];
  const subtaskText = subtaskItem.querySelector(".subtask-text");
  const subtaskIcons = subtaskItem.querySelector(".subtask-icons");

  subtaskItem.classList.add("editing");

  subtaskText.innerHTML = `
    <input type="text" class="edit-input" value="${subtasks[index].name}" onkeypress="handleEditKeyPress(event, ${index})">
  `;

  subtaskIcons.innerHTML = `
    <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
    <img src="../images/checkDark.svg" alt="Save" class="subtask-icon save-icon" onclick="saveSubtask(${index})">
  `;
  subtaskText.querySelector(".edit-input").focus();
}

function saveSubtask(index) {
  const input = document.querySelectorAll(".edit-input")[0];
  const newValue = input.value.trim();

  if (newValue !== "") {
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
  subInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      confirmSubtaskEntry();
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  initSubtaskUI();
  setupSubtaskListeners();
});
