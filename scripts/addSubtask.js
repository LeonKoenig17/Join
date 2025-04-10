// addSubtask.js
const subtasks = [];
const subInput = document.getElementById("subtask-input");
const addIcon = document.getElementById("add-icon");
const checkIcon = document.getElementById("check-subtask-icon");
const closeIcon = document.getElementById("close-subtask-icon");
const listContainer = document.getElementById("subtask-list");

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
  subInput.focus();
}

function cancelSubtaskEntry() {
  initSubtaskUI();
}

function confirmSubtaskEntry() {
  const val = subInput.value.trim();
  if (val !== "") {
  
    subtasks.push({ stage: 0 });
   
  }
  initSubtaskUI();
}

function updateSubtaskList() {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    html += subtasksTemplate(subtasks, index);
  }
  listContainer.innerHTML = html;
}

function addSubtask() {
  const subtaskInput = document.getElementById("subtask-input");
  const subtaskList = document.getElementById("subtask-list");
  const subtaskValue = subtaskInput.value.trim();

  if (subtaskValue !== "") {
    // Erstelle ein neues Listenelement
    const listItem = document.createElement("div");
    listItem.classList.add("subtask-item");
    listItem.innerHTML = `
      <span>${subtaskValue}</span>
      <img src="../images/paperbasketdelet.svg" alt="Delete" class="delete-icon" onclick="deleteSubtask(this)">
    `;

    // Füge das Listenelement zur Liste hinzu
    subtaskList.appendChild(listItem);

    // Leere das Eingabefeld
    subtaskInput.value = "";
  }
}

function deleteSubtask(index) {
  // Einfache Methode: Verschiebe alle Elemente ab index um eins nach vorne
  for (let i = index; i < subtasks.length - 1; i++) {
    subtasks[i] = subtasks[i + 1];
  }
  subtasks.length = subtasks.length - 1;
 
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
