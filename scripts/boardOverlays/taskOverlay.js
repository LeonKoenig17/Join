let currentTask = null;
let isEditing = false;

/**
 * Prüft für jeden Assignee in taskData.assignedTo, 
 * ob's einen User mit passender ID gibt, und setzt die Farbe.
 */
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

/**
 * Füllt das globale subtasks-Array anhand von taskData.subtasks.
 */
function initSubtasksArray(taskData) {
  subtasks.length = 0;
  if (!Array.isArray(taskData.subtasks)) return;
  for (let i = 0; i < taskData.subtasks.length; i++) {
    const s = taskData.subtasks[i];
    subtasks.push({ name: s.name, completed: s.completed });
  }
}

async function showTaskOverlay(taskData) {
  const users = await loadFirebaseUsers();
  checkUserColor(taskData, users);
  initSubtasksArray(taskData);

  currentTask = taskData;
  const overlayHTML = generateTaskOverlay(taskData);
  document.body.insertAdjacentHTML("beforeend", overlayHTML);
  updateSubtaskList();
  setTimeout(() => document.getElementById("taskOverlay").style.display = "flex", 0);
}

function showAddTaskOverlay() {
    renderAddTaskOverlay();
    initializeOverlayFeatures();
    setupTaskForm();
}

function renderAddTaskOverlay() {
    const overlayHTML = addTaskOverlayTemplate();
    document.body.insertAdjacentHTML("beforeend", overlayHTML);
}

function initializeOverlayFeatures() {
    const taskOverlay = document.getElementById("taskOverlay");
    if (taskOverlay) {
        taskOverlay.style.display = "flex";
        initPriorityButtons();
        initAssignedDropdown();
        initSubtaskUI();
        setupDatePicker();
        setupSubtaskListeners();
    }
}

function setupTaskForm() {
    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
        taskForm.addEventListener("submit", createTask);
    } else {
        console.error("taskForm element not found");
    }
}

  /**
 * Initialisiert die Priority-Buttons und setzt Event-Listener.
 */
function initPriorityButtons() {
    const priorityButtons = document.querySelectorAll(".priority-buttons .priority");
  
    priorityButtons.forEach(button => {
      button.addEventListener("click", function() {
        setPriority(button);
      });
    });
  }


/**
 * Schließt das Overlay
 */
function closeOverlay() {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.style.display = "none";
    setTimeout(() => {
      overlay.remove();
    }, 200);
  }
  currentTask = null;
  isEditing = false;
}

/**
 * Behandelt Klicks auf das Overlay
 * @param {Event} event - Das Klick-Event
 */
function handleOverlayClick(event) {
  if (event.target.id === "taskOverlay") {
    closeOverlay();
  }
}


/**
 * Erstellt ein Select-Element für die Priorität
 * @param {string} currentPriority - Die aktuelle Priorität
 * @returns {HTMLElement} Das Select-Element
 */
function createPrioritySelect(currentPriority) {
  const select = document.createElement("select");
  select.className = "priority-select";

  const priorities = ["Low", "Medium", "High", "Urgent"];
  priorities.forEach((priority) => {
    const option = document.createElement("option");
    option.value = priority;
    option.text = priority;
    option.selected = priority === currentPriority;
    select.appendChild(option);
  });

  return select;
}


/**
 * Patch-Helper: Aktualisiert beliebige Felder in Firebase.
 * @param {string|number} taskId – Firebase-ID des Tasks
 * @param {Object} updateObj – Objekt mit den zu ändernden Feldern
 */
async function patchTask(taskId, updateObj) {
  const url = BASE_URL + `tasks/${taskId}.json`;
  await fetch(url, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updateObj)
  });
}


function isAddMode() {
  // Prüfen, ob wir uns auf der Add-Task-Seite befinden
  return document.body.classList.contains('add-task-page');
}
/**
 * Rendert die Subtasks im Overlay neu.
 */
function updateSubtaskList() {
  const list = document.getElementById('subtask-list');
  if (!list) return;

  // Modus erkennen
  const addMode = isAddMode();

  // Subtasks rendern
  list.innerHTML = subtasks
    .map((s, i) => {
      return addMode
        ? subtasksTemplate(s, i) // Für Add-Task-Seite
        : taskOverlaySubtaskTemplate(s, i); // Für Edit-Task-Overlay
    })
    .join('');
}


/**
 * Rechnet neue Fortschritt-% aus und updatet
 * die Progressbar & den Zähler im Task-Card.
 */
function updateProgressBar() {
  const done  = subtasks.filter(s => s.completed).length;
  const total = subtasks.length;
  const pct   = total > 0 ? (done / total) * 100 : 0;
  const bar   = document.querySelector(`#task${currentTask.taskIndex} .subtask-progress-bar`);
  const label = document.querySelector(`#task${currentTask.taskIndex} .subtask-count`);
  if (bar)   bar.style.width   = `${pct}%`;
  if (label) label.textContent = `${done}/${total} Subtasks`;
}

/**
 * Wird vom onclick der Checkbox aufgerufen.
 * Umschalten, UI updaten und in Firebase patchen.
 */
async function toggleSubtaskCompletion(index) {
  subtasks[index].completed = !subtasks[index].completed;

  updateSubtaskList();
  updateProgressBar();

  const updatedSubtasks = subtasks.map(s => ({
    name: s.name,
    completed: s.completed
  }));
  await patchTask(currentTask.id, { subtasks: updatedSubtasks });
}

/**
 * Löscht einen Task aus Firebase und lädt das Board neu.
 */
async function deleteTask(taskId) {
  const url = BASE_URL + `tasks/${taskId}.json`;
  await fetch(url, { method: 'DELETE' });
  closeOverlay();
  window.location.reload();
}

/**
 * Fragt per Popup, ob der Task wirklich gelöscht werden soll.
 */
function confirmDeleteTask(event, taskId) {
  event.stopPropagation();
  if (!window.confirm('Delete permanently?')) return;
  deleteTask(taskId);
}





async function showEditTaskOverlay(taskId) {
  // 1) Daten holen
  let taskData = currentTask && currentTask.id === taskId ? currentTask : null;
  if (!taskData) {
    const all = await loadData('tasks');
    const raw = all[taskId];
    taskData = { id: taskId, ...raw };
  }

  const users = await loadFirebaseUsers();

  // 2) Overlay rendern & Grund-Features initialisieren
  const overlayHTML = editTaskOverlayTemplate(taskData, users);
  document.body.insertAdjacentHTML('beforeend', overlayHTML);
  initializeOverlayFeatures();

  // ───────────────────────────────────────
  // 3) Subtask-Modul initialisieren:
  //    hier bindest du +, Enter, Prefill & Rendern
  initSubtaskUI();               // leert das Input-Feld
  setupSubtaskListeners();       // bindet das „+“-Icon & Enter
  initSubtasksArray(taskData);   // füllt global subtasks[] aus taskData
  updateSubtaskList();           // rendert sie sofort ins DOM
  // ───────────────────────────────────────

  // 4) Listener für Save-Button
  document.getElementById('save-task-btn').addEventListener('click', async () => {
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
