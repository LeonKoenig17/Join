/**
 * taskOverlay.js - Verwalten von Anzeige-, Bearbeitungs- und Erstellungs-Overlays für Tasks
 */

let currentTask = null;
let isEditing = false;


/**
 * Initialisiert alle Overlay-Komponenten für Edit/Add.
 *
 * @param {HTMLElement} overlayContainer  Container-Element des Overlays
 * @param {Array}       assignees         Gemergtes Array aus Usern + Contacts
 * @param {Object}      taskData          Aktuelle Task-Daten
 */
function initOverlaySetup(overlayContainer, assignees, taskData) {
  initPriorityButtons(overlayContainer);
  renderDropdownOptions(assignees, taskData.assignedTo || []);
  updateAssignedChips(assignees);
  setupDropdownEventListeners(assignees);
  initializeOverlayFeatures();
  initializeSubtaskModule(taskData);
  toggleIcons(false);
}


function initializeOverlayFeatures() {
  const taskOverlay = document.getElementById("taskOverlay");
  if (taskOverlay) {
    taskOverlay.style.display = "flex";
    initPriorityButtons();
    setupDatePicker();
    applyUserColors();
  } else if (document.body.classList.contains("add-task-page")) {
    initPriorityButtons();
    setupDatePicker();
    setupFieldListeners();
  }
}


function showTaskOverlayById(taskId) {
  document.body.classList.add("no-scroll");
  showTaskOverlay(taskId);
}


async function showTaskOverlay(taskId) {
  const [users, allTasks] = await Promise.all([
    loadFirebaseUsers(),
    loadData("tasks")
  ]) || [[], {}];

  const rawTask = allTasks?.[taskId];
  if (!rawTask) {
    console.warn(`Task ${taskId} nicht gefunden`);
    return;
  }
  const taskData = { id: taskId, ...rawTask };
  checkUserColor(taskData, users);
  initSubtasksArray(taskData);
  currentTask = taskData;

  const overlayContainer = document.getElementById("taskOverlay");
  overlayContainer.innerHTML     = generateTaskOverlay(taskData);
  overlayContainer.classList.remove("d-none");
  overlayContainer.style.display = "flex";

  initOverlaySetup(overlayContainer, users, taskData);
  updateSubtaskList(taskId);
}


function showAddTaskOverlay(stage) {
  document.body.classList.add("no-scroll");
  const overlayHTML = addTaskOverlayTemplate(stage);
  document.body.classList.add("add-task-page");
  const container = document.getElementById("taskOverlay");
  if (container) {
    container.innerHTML     = overlayHTML;
    container.classList.remove("d-none");
    container.style.display = "flex";
  }

  initPriorityButtons();
  initializeOverlayFeatures();
  setupTaskForm(stage);
  setupSubtaskListeners();
  checkSubtaskClass();

  Promise.all([loadFirebaseUsers(), loadFirebaseContacts()])
    .then(([users, contacts]) => {
      const assignees = [...users, ...contacts];
      renderDropdownOptions(assignees);
      setupDropdownEventListeners(assignees);
      updateAssignedChips(assignees);
    })
    .catch(err => console.error("Dropdown init fehlgeschlagen:", err));
}


/**
 * Lädt Task oder liefert null, wenn nicht vorhanden.
 */
async function loadTaskById(id) {
  if (currentTask?.id === id) return currentTask;
  const all = await loadData("tasks") || {};
  const raw = all[id];
  return raw ? { id, ...raw, subtasks: raw.subtasks || [] } : null;
}


/**
 * Registriert den Klick-Handler des Speichern-Buttons,
 * um die Task-Daten zu sammeln und zu patchen.
 *
 * @param {HTMLElement} overlayContainer  Container des Overlays
 * @param {Object}      taskData          Aktuelle Task-Daten
 */
function registerSaveTaskHandler(overlayContainer, taskData) {
  const saveBtn = overlayContainer.querySelector("#save-task-btn");
  saveBtn.addEventListener("click", async () => {
    const data = getFormData();
    if (!validateFormData(data)) return;
    await patchTask(taskData.id, {
      ...data,
      subtasks: subtasks.map(s => ({ name: s.name, completed: s.completed }))
    });
    closeOverlay();
    window.location.reload();
  });
}


async function showEditTaskOverlay(taskId) {
  closeOverlay();
  document.body.classList.add("no-scroll");
  const taskData = await loadTaskById(taskId);
  if (!taskData) return;

  const [users, contacts] = await Promise.all([
    loadFirebaseUsers(),
    loadFirebaseContacts()
  ]);
  const assignees = [...users, ...contacts];

  const overlayContainer = document.getElementById("taskOverlay");
  overlayContainer.innerHTML     = editTaskOverlayTemplate(taskData, assignees);
  overlayContainer.classList.remove("d-none");
  overlayContainer.style.display = "flex";

  initOverlaySetup(overlayContainer, assignees, taskData);

  setupSubtaskListeners();
  checkSubtaskClass();
  registerSaveTaskHandler(overlayContainer, taskData);

  currentTask = taskData;
}


function closeOverlay() {
  document.body.classList.remove("no-scroll");
  const container = document.getElementById("taskOverlay");
  if (container) {
    container.innerHTML = "";
    container.classList.add("d-none");
    container.style.display = "none";
    if (typeof subtasks !== "undefined") {
      subtasks.length = 0;
    }
  }
  document.body.classList.remove("add-task-page");
  currentTask = null;
  isEditing = false;
}


function checkUserColor(taskData, users) {
  if (!Array.isArray(taskData.assignedTo)) return;
  taskData.assignedTo.forEach(ass => {
    const u = users.find(u => u.id === ass.id);
    if (u) ass.color = u.color;
  });
}


function handleOverlayClick(event) {
  if (event.target.id === "taskOverlay") {
    closeOverlay();
  }
}