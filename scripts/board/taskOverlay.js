/**
 * taskOverlay.js - Verwalten von Anzeige-, Bearbeitungs- und Erstellungs-Overlays für Tasks
 */

let currentTask = null;
let isEditing = false;


function showTaskOverlayById(taskId) {
  showTaskOverlay(taskId);
}


function showTaskOverlay(taskId) {
  loadFirebaseUsers().then(async (users) => {
    const allTasks = await loadData('tasks');
    const rawTask = allTasks[taskId];

    if (!rawTask) {
      alert("Task nicht gefunden");
      return;
    }

    const taskData = { id: taskId, ...rawTask };
    checkUserColor(taskData, users);
    initSubtasksArray(taskData);
    currentTask = taskData;

    const overlayHTML = generateTaskOverlay(taskData);
    const container = document.getElementById("taskOverlay");
    if (container) {
      container.innerHTML = overlayHTML;
      container.classList.remove("d-none");
      container.style.display = "flex";
    }

    updateSubtaskList();
  });
}


function showAddTaskOverlay(stage) {
  const overlayHTML = addTaskOverlayTemplate(stage);
  document.body.classList.add("add-task-page");
  const container = document.getElementById("taskOverlay");
  if (container) {
    container.innerHTML = overlayHTML;
    container.classList.remove("d-none");
    container.style.display = "flex";
  }

  initPriorityButtons();
  initializeOverlayFeatures();
  setupTaskForm(stage);

    loadFirebaseUsers().then(users => {
    renderDropdownOptions(users);
    setupDropdownEventListeners(users);
    updateAssignedChips(users);
  });
}


/**
 * Lädt Task oder liefert null, wenn nicht vorhanden.
 */
async function loadTaskById(id) {
  if (currentTask?.id === id) return currentTask;
  const all = await loadData('tasks') || {};
  const raw = all[id];
  return raw ? { id, ...raw, subtasks: raw.subtasks || [] } : null;
}


/**
 * Initialisiert alle Overlay-Komponenten für Edit/Add.
 *
 * @param {HTMLElement} overlayContainer  Container-Element des Overlays
 * @param {Array}       users             Liste aller User
 * @param {Object}      taskData          Aktuelle Task-Daten
 */
function initOverlaySetup(overlayContainer, users, taskData) {
  initPriorityButtons(overlayContainer);
  renderDropdownOptions(users, taskData.assignedTo || []);
  updateAssignedChips(users);
  setupDropdownEventListeners(users);
  initializeOverlayFeatures();
  initializeSubtaskModule(taskData);
}



/**
 * Registriert den Klick-Handler des Speichern-Buttons,
 * um die Task-Daten zu sammeln und zu patchen.
 *
 * @param {HTMLElement} overlayContainer  Container des Overlays
 * @param {Object}      taskData          Aktuelle Task-Daten
 */
function registerSaveTaskHandler(overlayContainer, taskData) {
  const saveBtn = overlayContainer.querySelector('#save-task-btn');
  saveBtn.addEventListener('click', async () => {
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

  const taskData        = await loadTaskById(taskId);
  if (!taskData) return;

  const users            = await loadFirebaseUsers();
  const overlayContainer = document.getElementById('taskOverlay');

  overlayContainer.innerHTML     = editTaskOverlayTemplate(taskData, users);
  overlayContainer.classList.remove('d-none');
  overlayContainer.style.display = 'flex';

  initOverlaySetup(overlayContainer, users, taskData);
  registerSaveTaskHandler(overlayContainer, taskData);

  currentTask = taskData;
}




function closeOverlay() {
  const container = document.getElementById("taskOverlay");
  if (container) {
    container.innerHTML = "";
    container.classList.add("d-none");
    container.style.display = "none";
    if (typeof subtasks !== 'undefined') {
      subtasks.length = 0;
    }
  }
  document.body.classList.remove("add-task-page");
  currentTask = null;
  isEditing = false;
}


function checkUserColor(taskData, users) {
    if (!Array.isArray(taskData.assignedTo)) return;
    for (let i = 0; i < taskData.assignedTo.length; i++) {
      const ass = taskData.assignedTo[i];
      for (let j = 0; j < users.length; j++) {
        if (users[j].id === ass.id) {
          ass.color = users[j].color;
          break;
        }
      }
    }
  }


function handleOverlayClick(event) {
  if (event.target.id === "taskOverlay") {
    closeOverlay();
  }
}

