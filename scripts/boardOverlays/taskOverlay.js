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
     const existing = document.getElementById("taskOverlay");

      if (existing) existing.remove();
      const overlayHTML = addTaskOverlayTemplate();
     document.body.insertAdjacentHTML("beforeend", overlayHTML); //ermöglicht es dir, einen HTML-String direkt in den DOM einzufügen
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
      applyUserColors();
      setupFieldListeners();
  }
}

function setupTaskForm() {
  const taskForm = document.getElementById("taskForm");
  if (taskForm) {
    taskForm.addEventListener("submit", function(e) {
      e.preventDefault();
      const data = getFormData();
      if (!data) return;
      if (!validateFormData(data)) return;
      createTask();
    });
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
function closeOverlay(force = false) {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) {
    overlay.remove(); // sofort – KEIN timeout
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


function initializeSubtaskModule(taskData) {
  initSubtasksArray(taskData);
  initSubtaskUI();
  setupSubtaskListeners();
  updateSubtaskList();
}

function initSubtasksArray(taskData) {
    subtasks.length = 0;
    if (!Array.isArray(taskData.subtasks)) return;
    for (let i = 0; i < taskData.subtasks.length; i++) {
        const s = taskData.subtasks[i];
        subtasks.push({ name: s.name, completed: s.completed });
    }
}


async function showEditTaskOverlay(taskId) {
  try {
    if (document.getElementById('taskOverlay')) {
      closeOverlay(true);
    }

    let taskData = currentTask && currentTask.id === taskId ? currentTask : null;
    if (!taskData) {
      const all = await loadData('tasks');
      const raw = all[taskId];
      if (!raw) throw new Error('Task not found');
      taskData = { id: taskId, ...raw };
    }

    const users = await loadFirebaseUsers();

    const overlayHTML = editTaskOverlayTemplate(taskData, users);
    document.body.insertAdjacentHTML('beforeend', overlayHTML);

    setTimeout(() => {
      renderDropdownOptions(users, taskData.assignedTo || []);
      updateAssignedChips(users);
    }, 50);
    
    initializeOverlayFeatures();
    initializeSubtaskModule(taskData);
    
  
    document.getElementById('save-task-btn').addEventListener('click', async () => {
      const data = getFormData();
      if (!validateFormData(data)) {
        alert('Please fill out all required fields.');
        return;
      }

      try {
        await patchTask(taskData.id, {
          ...data,
          subtasks: subtasks.map((s) => ({ name: s.name, completed: s.completed })),
        });
        closeOverlay();
        window.location.reload();
      } catch (error) {
        console.error('Error saving task:', error);
        alert('An error occurred while saving the task. Please try again.');
      }
    });
  } catch (error) {
    console.error('Error loading edit task overlay:', error);
  }
}



async function saveTask(taskId) {
  const data = getFormData();
  if (!validateFormData(data)) return;

  const updatedTask = {
    title: data.title,
    description: data.description,
    dueDate: data.dueDate,
    priority: data.priority,
    category: data.category,
    assignedTo: data.assignedTo,
    subtasks: getSanitizedSubtasks(),
    stage: currentTask.stage,
    taskIndex: currentTask.taskIndex
  };

  try {
    await patchTask(taskId, updatedTask);
    closeOverlay();
    await fetchData();
    await renderLists();
    highlightTask(updatedTask.taskIndex);
    showToast("Task gespeichert");
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    showToast("Fehler beim Speichern");
  }
}

async function updateTaskInFirebase(taskId, updatedTask) {

  const db = firebase.firestore();
  await db.collection("tasks").doc(taskId).update(updatedTask);
  console.log(`Task ${taskId} updated successfully in Firebase.`);
}

async function reloadBoard() {
  const tasks = await loadTasksFromFirebase();

  const boardContainer = document.getElementById("board-container");
  boardContainer.innerHTML = tasks.map((task) => generateTaskCard(task)).join("");
}