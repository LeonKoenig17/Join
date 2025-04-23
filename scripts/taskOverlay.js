let currentTask = null;
let isEditing = false;

/**
 * Zeigt das Task-Overlay an
 * @param {Object} taskData - Die Daten des Tasks
 */
function showTaskOverlay(taskData) {
  currentTask = taskData;

  subtasks.length = 0;
  if (Array.isArray(taskData.subtasks)) {
    taskData.subtasks.forEach(s => {
      subtasks.push({
        name: s.name,
        completed: s.completed
      });
    });
  }

  const overlayHTML = generateTaskOverlay(taskData);
  document.body.insertAdjacentHTML("beforeend", overlayHTML);

  updateSubtaskList();

  setTimeout(() => {
    document.getElementById("taskOverlay").style.display = "flex";
  }, 0);
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
    }, 200); // Warte auf Animation
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


/**document.addEventListener("DOMContentLoaded", function() {
    const taskForm = document.getElementById("taskForm");
    if (taskForm) {
      taskForm.addEventListener("submit", createTask);
    } else {
      console.error("taskForm element not found");
    }
  });*/