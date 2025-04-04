// Alle globalen Variablen und DOM-Elemente
const BASE_URL =
  "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
let subtasks = [];
const dateInput = document.getElementById("due-date");
const pickerIcon = document.querySelector(".custom-date-input img");
const priorityButtons = document.querySelectorAll(".priority-buttons .priority");
const assignedToSelect = document.getElementById("assignedDropdownSelected");
const categorySelect = document.getElementById("categorySelect");
const subtaskInput = document.getElementById("subtaskInput");
const addSubtaskBtn = document.querySelector(".add-subtask");
const createTaskBtn = document.querySelector(".create-button");
const messageDiv = document.getElementById("message");
let subtaskList = document.getElementById("subtask-list");
if (!subtaskList) {
  document.querySelector(".subtask-input").innerHTML +=
    "<div id='subtask-list'></div>";
  subtaskList = document.getElementById("subtask-list");
}

function init() {
  setupDatePicker();
  setupPriorityButtons();
  loadAndRenderAssignedContacts();
  setupSubtaskInput();
  setupCreateTaskButton();
}

// Firebase-Funktionen
async function loadData(path = "") {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}
async function postData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}
async function updateData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}
async function deleteData(path = "") {
  const response = await fetch(BASE_URL + path + ".json", { method: "DELETE" });
  try {
    return (await response.json()) || { success: true };
  } catch (e) {
    return { success: true };
  }
}

// UI-Setup-Funktionen (mit innerHTML und Templates)
function setupDatePicker() {
  pickerIcon.addEventListener("click", function () {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}
function setupPriorityButtons() {
  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].addEventListener("click", function () {
      for (let j = 0; j < priorityButtons.length; j++) {
        priorityButtons[j].classList.remove("active-btn");
      }
      this.classList.add("active-btn");
    });
  }
}

async function createTask() {
  const data = getFormData();
  if (!validateFormData(data)) {
    showMessage("Bitte fülle alle erforderlichen Felder aus.");
    return;
  }
  try {
    await postData("tasks", data); // Speichert den Task in Firebase
    showMessage("Aufgabe wurde erfolgreich erstellt.");
    clearForm();
  } catch (err) {
    console.error("Fehler:", err);
    showMessage("Fehler beim Erstellen der Aufgabe.");
  }
}

function setupSubtaskInput() {
  subtaskInput.addEventListener("input", function () {
    addSubtaskBtn.disabled = subtaskInput.value.trim() === "";
  });
  addSubtaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const text = subtaskInput.value.trim();
    if (text !== "") {
      subtasks.push(text);
      updateSubtaskList();
      subtaskInput.value = "";
      addSubtaskBtn.disabled = true;
    }
  });
}
function updateSubtaskList() {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    html += subtaskTemplate(subtasks[i], i);
  }
  subtaskList.innerHTML = html;
  const btns = subtaskList.getElementsByClassName("delete-subtask");
  for (let j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"), 10);
      let newSubs = [];
      for (let k = 0; k < subtasks.length; k++) {
        if (k !== index) {
          newSubs.push(subtasks[k]);
        }
      }
      subtasks = newSubs;
      updateSubtaskList();
    });
  }
}
function getFormData() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = dateInput.value;
  let priority = "";
  for (let i = 0; i < priorityButtons.length; i++) {
    if (priorityButtons[i].classList.contains("active-btn")) {
      priority = priorityButtons[i].textContent.trim();
      break;
    }
  }
  return {
    title,
    description,
    dueDate,
    priority,
    assignedTo: getAssignedContacts(),
    category: categorySelect.value,
    subtasks,
  };
}


function validateFormData(data) {
  return (
    data.title &&
    data.dueDate &&
    data.category &&
    data.category !== "Select task category"
  );
}
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  dateInput.value = "";
  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].classList.remove("active-btn");
  }
  if (priorityButtons[1]) {
    priorityButtons[1].classList.add("active-btn");
  }
  if (assignedToSelect) {
    assignedToSelect.selectedIndex = 0;
  }
  if (categorySelect) {
    categorySelect.selectedIndex = 0;
  }
  subtasks = [];
  updateSubtaskList();
}
function showMessage(msg) {
  messageDiv.innerHTML = msg;
}

function setupCreateTaskButton() {
  createTaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
    createTask();
  });
}
async function updateTask(taskId, updatedTask) {
  try {
    await updateData("tasks/" + taskId, updatedTask);
    console.log("Task updated");
  } catch (err) {
    console.error("Error updating task:", err);
  }
}
async function removeTask(taskId) {
  try {
    await deleteData("tasks/" + taskId);
    console.log("Task deleted");
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

/**
 * A reference to the HTML input element for selecting a due date.
 * This element is expected to have the ID 'due-date'.
 *
 * @type {HTMLInputElement | null}
 */
document
  .querySelector(".custom-date-input img")
  .addEventListener("click", () => {
    dateInput.showPicker ? dateInput.showPicker() : dateInput.focus();
  });


  /**
 * Extrahiert die Initialen aus einem Namen, z.B. "Sofia Müller" -> "SM".
 * @param {string} name - Voller Name des Benutzers.
 * @returns {string} Die ermittelten Initialen.
 */
function getInitials(name) {
  if (!name) return "NN"; // "No Name"
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  } else {
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return first + last;
  }
}

async function loadAndRenderAssignedContacts() {
  const users = await loadData("login");
  const assignedEl = document.getElementById("assignedDropdownSelected");
  if (!assignedEl) {
    console.error("Element with id 'assignedDropdownSelected' not found!");
    return;
  }
  if (users) {
    const keys = Object.keys(users);
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i],
            user = users[id];
      assignedEl.innerHTML += assignedUserTemplate(user, i);
    }
  }
}

