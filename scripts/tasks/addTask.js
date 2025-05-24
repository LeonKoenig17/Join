/**
 * addTask.js - Enthält alle Logiken und Hilfsfunktionen zur Erstellung eines neuen Tasks.
 */

let activePriorityButton = null;
let priorityButtons = [];

/**
 * Initialisiert die Add-Task-Seite.
 */
function initAddTask(){
  fillUserLinks();
  getCurrentHTML();
  addHelpToPopup();
}


/**
 * Richtet das Formular zur Erstellung eines Tasks ein.
 * @param {string} stage - Die Phase des Tasks (z. B. 'todo', 'inProgress').
 */
function setupTaskForm(stage) {
  const taskForm = document.getElementById("taskForm");
  if (!taskForm) return;

  taskForm.addEventListener("submit", function (e) {
    e.preventDefault();
    createTask(stage);
  });
}


/**
 * Erstellt einen neuen Task basierend auf den Formulardaten.
 * @param {string} stage - Die Phase des Tasks (z. B. 'todo', 'inProgress').
 */
async function createTask(stage) {
  const data = getFormData();
  if (!validateFormData(data)) return;

  const stageMap = { todo: 0, inProgress: 1, awaitFeedback: 2, done: 3 };
  data.stage = stageMap[stage] ?? 0;
  data.taskIndex = Date.now();

  try {
    await postData("tasks", data);
    clearForm();
    closeOverlay(true);
    window.location.href = "board.html";
  } catch (err) {
    console.error("Fehler:", err);
  }
}


/**
 * Gibt die Phase eines Tasks basierend auf seinem Status zurück.
 * @param {string} status - Der Status des Tasks.
 * @returns {number} Die Phase des Tasks.
 */
function getStageFromStatus(status) {
  const map = { todo: 0, inProgress: 1, awaitFeedback: 2, done: 3 };
  return map[status] ?? 0;
}


/**
 * Holt die Daten aus dem Formular.
 * @returns {Object|null} Die Formulardaten oder null, wenn ungültig.
 */
function getFormData() {
  const elements = getFormElements();
  if (!validateFormElements(elements)) return null;
  const { title, description, dueDate, category } = getFormValues(elements);
  const priority = getActivePriority();
  const assignedTo = getAssignedContacts();
  const subtasksData = getSubtasksData();

  return {
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    category,
    subtasks: subtasksData,
  };
}


/**
 * Extrahiert die Werte aus den Formularelementen.
 * @param {Object} elements - Die Formularelemente.
 * @returns {Object} Die extrahierten Werte.
 */
function getFormValues(elements) {
  const { titleInput, descriptionInput, dateInput, categorySelect } = elements;

  return {
    title: titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    dueDate: dateInput.value.trim(),
    category: categorySelect.value,
  };
}


/**
 * Holt die Formularelemente.
 * @returns {Object} Die Formularelemente.
 */
function getFormElements() {
  return {
    titleInput: document.getElementById("title"),
    descriptionInput: document.getElementById("description"),
    dateInput: document.getElementById("due-date"),
    categorySelect: document.getElementById("categorySelect"),
    priorityButtons: document.querySelectorAll(".priority-buttons .priority"),
  };
}


/**
 * Validiert die Formularelemente.
 * @param {Object} elements - Die Formularelemente.
 * @returns {boolean} True, wenn gültig, sonst false.
 */
function validateFormElements(elements) {
  return (
    elements.titleInput &&
    elements.descriptionInput &&
    elements.dateInput &&
    elements.categorySelect &&
    elements.priorityButtons.length > 0
  );
}


/**
 * Validiert die Formulardaten.
 * @param {Object} data - Die Formulardaten.
 * @returns {boolean} True, wenn gültig, sonst false.
 */
function validateFormData(data) {
  const titleInput = document.getElementById("title");
  
  const dateInput = document.getElementById("due-date");
  const categorySelect = document.getElementById("categorySelect");

  if (!titleInput || !dateInput || !categorySelect) {
    return false;
  }

  let isValid = true;

  if (!data.title) {
    titleInput.classList.add("fieldIsRequired");
    document.getElementById("title-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    titleInput.classList.remove("fieldIsRequired");
    document.getElementById("title-error").textContent = "";
  }

  if (!data.dueDate) {
    dateInput.classList.add("fieldIsRequired");
    document.getElementById("due-date-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    dateInput.classList.remove("fieldIsRequired");
    document.getElementById("due-date-error").textContent = "";
  }

  if (categorySelect) {
    if (!data.category || data.category === "Select a category") {
    categorySelect.classList.add("fieldIsRequired");
     document.getElementById("category-error").textContent =
     "This field is required";
     isValid = false;
  } else {
    categorySelect.classList.remove("fieldIsRequired");
    document.getElementById("category-error").textContent = "";
  }
}

  return isValid;
}


/**
 * Holt die aktive Priorität aus den Buttons.
 * @returns {string} Die aktive Priorität.
 */
function getActivePriority() {
  const buttons = document.querySelectorAll(".priority-buttons .priority");
  for (let btn of buttons) {
    if (btn.classList.contains("active-btn")) return btn.textContent.trim();
  }
  return "";
}


/**
 * Holt die zugewiesenen Kontakte aus den Checkboxen.
 * @returns {Array<Object>} Die zugewiesenen Kontakte.
 */
function getAssignedContacts() {
  const checkboxes = document.querySelectorAll(".assign-checkbox");
  const contacts = [];

  for (let i = 0; i < checkboxes.length; i++) {
    const cb = checkboxes[i];
    if (cb.checked) {
      const id = cb.dataset.userId;
      const name = cb.dataset.userName;
      const email = cb.dataset.userEmail;
      const color = cb.dataset.userColor;

      if (!id || !name || !email || !color) {
        console.warn("⚠️ Incomplete contact data:", { id, name, email, color });
        continue;
      }

      contacts.push({ id, name, email, color });
    }
  }
  return contacts;
}


/**
 * Holt die Daten der Unteraufgaben.
 * @returns {Array<Object>} Die Unteraufgabendaten.
 */
function getSubtasksData() {
  return subtasks
    .filter(s => s.name?.trim())
    .map(s => ({ name: s.name, completed: false }));
}


/**
 * Leert das Formular und setzt es zurück.
 */
function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("due-date").value = "";

  document.querySelectorAll(".priority").forEach((btn) =>
    btn.classList.remove("active-btn")
  );
  document.getElementById("categorySelect").selectedIndex = 0;
  document.getElementById("assignedChips").innerHTML = "";
  subtasks.length = 0;
    document.getElementById("subtask-list").innerHTML = "";

  updateSubtaskList();
}


/**
 * Initialisiert die Prioritätsbuttons.
 * @param {Document|HTMLElement} [scope=document] - Der Bereich, in dem die Buttons gesucht werden.
 */
function initPriorityButtons(scope = document) {
  priorityButtons = scope.querySelectorAll(".priority-buttons .priority");
  activePriorityButton = scope.querySelector(".priority.active-btn");
  priorityButtons.forEach((btn) => {
    btn.addEventListener("click", () => setPriority(btn));
  });
}


/**
 * Setzt die Priorität basierend auf dem ausgewählten Button.
 * @param {HTMLElement} button - Der ausgewählte Button.
 */
function setPriority(button) {
  activePriorityButton = button;
  priorityButtons.forEach((btn) => btn.classList.remove("active-btn"));
  button.classList.add("active-btn");
}


/**
 * Richtet den Datepicker ein.
 */
function setupDatePicker() {
  const dateInput = document.getElementById("due-date");
  if (!dateInput) return;
  const icon = document.querySelector(".custom-date-input img");

  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;

  const year = new Date().getFullYear();
  dateInput.max = `${year}-12-31`;

  if (icon) {
    icon.addEventListener("click", () => {
      if (dateInput.showPicker) dateInput.showPicker();
      else dateInput.focus();
    });
  }
}


/**
 * Fügt Event-Listener zu den Formularfeldern hinzu.
 */
function setupFieldListeners() {
  ["title", "due-date", "categorySelect"].forEach((id) => {
    const field = document.getElementById(id);
    if (!field) return;

    field.addEventListener("input", () => {
      field.classList.remove("fieldIsRequired");
      const err = document.getElementById(`${id}-error`);
      if (err) err.textContent = "";
    });
  });
}


/**
 * Löscht einen Task basierend auf seiner ID.
 * @param {string} taskId - Die ID des zu löschenden Tasks.
 */
async function deleteTask(taskId) {
    await fetch(BASE_URL + `tasks/${taskId}.json`, { method: "DELETE" });
    closeOverlay();
    window.location.reload();
  }


/**
 * Zeigt das Bestätigungs-Template für das Löschen eines Tasks an.
 * @param {Event} event - Das auslösende Event.
 * @param {string} taskId - Die ID des zu löschenden Tasks.
 */
function showDeleteTemplate(event, taskId) {
  event.stopPropagation();
  const deleteOverlay = document.getElementById("dialogContainer");
  deleteOverlay.innerHTML = deleteConfirmTemplate(taskId);
}


/**
 * Schließt den Bestätigungsdialog.
 * @param {Event} event - Das auslösende Event.
 */
function closeConfirmDialog(event) {
  if (event && event.target.id !== "confirmDialog") return;
  const deleteOverlay = document.getElementById("dialogContainer");
  deleteOverlay.innerHTML = "";
}


/**
 * Bestätigt das Löschen eines Tasks.
 * @param {string} taskId - Die ID des zu löschenden Tasks.
 */
function deleteTaskConfirmed(taskId) {
  deleteTask(taskId);
  closeConfirmDialog();
}


/**
 * Initialisiert die Add-Task-Seite beim Laden.
 */
function initAddTaskPage() {
  initPriorityButtons();
  setupDatePicker();
  setupFieldListeners();
  setupTaskForm('todo');
  initAssignedDropdown().then(users => updateAssignedChips(users));
}
document.addEventListener('DOMContentLoaded', initAddTaskPage);