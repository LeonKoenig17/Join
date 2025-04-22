let currentTask = null;
let isEditing = false;

/**
 * Zeigt das Task-Overlay an
 * @param {Object} taskData - Die Daten des Tasks
 */
function showTaskOverlay(taskData) {
  currentTask = taskData;
  const overlayHTML = generateTaskOverlay(taskData);

  removeExistingOverlay();

  document.body.insertAdjacentHTML("beforeend", overlayHTML);

  setTimeout(() => {
    document.getElementById("taskOverlay").style.display = "flex";
  }, 0);
}

/**
 * Entfernt ein bestehendes Overlay falls vorhanden
 */
function removeExistingOverlay() {
  const existingOverlay = document.getElementById("taskOverlay");
  if (existingOverlay) {
    existingOverlay.remove();
  }
}

/**
 * Schließt das Task-Overlay
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
 * Aktiviert den Bearbeitungsmodus für einen Task
 * @param {string} taskId - Die ID des zu bearbeitenden Tasks
 */
function editTask(taskId) {
  if (isEditing) return;
  isEditing = true;

  const taskCard = document.querySelector(".task-card");
  if (!taskCard) return;

  makeFieldsEditable(taskCard);

  updateActionButtons(taskCard, taskId);
}

/**
 * Macht die Felder eines Tasks editierbar
 * @param {HTMLElement} taskCard - Die Task-Karte
 */
function makeFieldsEditable(taskCard) {
  const editableElements = {
    ".task-title": "text",
    ".date": "date",
    ".priority-level": "select",
  };

  for (const [selector, type] of Object.entries(editableElements)) {
    const element = taskCard.querySelector(selector);
    if (!element) continue;

    if (type === "select") {
      const currentPriority = element.textContent;
      const select = createPrioritySelect(currentPriority);
      element.parentNode.replaceChild(select, element);
    } else {
      element.contentEditable = true;
      element.classList.add("editable");
    }
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
 * Aktualisiert die Aktions-Buttons
 * @param {HTMLElement} taskCard - Die Task-Karte
 * @param {string} taskId - Die Task-ID
 */
function updateActionButtons(taskCard, taskId) {
  const actionButtons = taskCard.querySelector(".task-actions");
  if (!actionButtons) return;

  actionButtons
    .querySelectorAll("button")
    .forEach((btn) => (btn.style.display = "none"));

  const saveButton = document.createElement("button");
  saveButton.className = "save-btn";
  saveButton.textContent = "Speichern";
  saveButton.onclick = () => saveTaskChanges(taskId);

  const cancelButton = document.createElement("button");
  cancelButton.className = "cancel-btn";
  cancelButton.textContent = "Abbrechen";
  cancelButton.onclick = () => cancelEditing(taskId);

  actionButtons.appendChild(saveButton);
  actionButtons.appendChild(cancelButton);
}

/**
 * Speichert die Änderungen eines Tasks
 * @param {string} taskId - Die ID des zu speichernden Tasks
 */
async function saveTaskChanges(taskId) {
  const taskCard = document.querySelector(".task-card");
  if (!taskCard) return;

  const updatedTask = {
    ...currentTask,
    title: taskCard.querySelector(".task-title").textContent,
    dueDate: taskCard.querySelector(".date").textContent,
    priority:
      taskCard.querySelector(".priority-select")?.value ||
      taskCard.querySelector(".priority-level").textContent,
  };

  try {
    currentTask = updatedTask;
    isEditing = false;
    showTaskOverlay(updatedTask);
  } catch (error) {
    console.error("Fehler beim Speichern:", error);
    alert("Fehler beim Speichern der Änderungen");
  }
}

/**
 * Bricht die Bearbeitung ab
 * @param {string} taskId - Die ID des Tasks
 */
function cancelEditing(taskId) {
  isEditing = false;
  showTaskOverlay(currentTask);

  /**
   * Löscht einen Task
   * @param {string} taskId - Die ID des zu löschenden Tasks
   */
  async function deleteTask(taskId) {
    if (!confirm("Möchten Sie diese Aufgabe wirklich löschen?")) return;

    try {
      closeOverlay();

    } catch (error) {
      console.error("Fehler beim Löschen:", error);
      alert("Fehler beim Löschen der Aufgabe");
    }
  }

  /**
   * Aktualisiert den Status einer Subtask
   * @param {string} subtaskId - Die ID der Subtask
   * @param {boolean} completed - Der neue Status
   */
  async function updateSubtask(subtaskId, completed) {
    if (!currentTask) return;

    try {
      const subtask = currentTask.subtasks.find((st) => st.id === subtaskId);
      if (subtask) {
        subtask.completed = completed;
      }
    } catch (error) {
      console.error("Fehler beim Aktualisieren der Subtask:", error);
      alert("Fehler beim Aktualisieren der Subtask");
    }
  }

  /**
   * Aktualisiert die Priorität eines Tasks
   * @param {number} taskId - Die ID des Tasks
   * @param {string} newPriority - Die neue Priorität
   */
  function updatePriority(taskId, newPriority) {
    console.log("Ändere Priorität für Task:", taskId, "zu:", newPriority);
    const priorityElement = document.querySelector(".priority-level");
    if (priorityElement) {
      priorityElement.textContent = newPriority;
    }
  }

  /**
   * Fügt eine neue Subtask hinzu
   * @param {number} taskId - Die ID des Tasks
   * @param {string} subtaskText - Der Text der neuen Subtask
   */
  function addSubtask(taskId, subtaskText) {
    if (!subtaskText.trim()) return;

    const newSubtask = {
      id: Date.now(),
      text: subtaskText,
      completed: false,
    };

    if (currentTask) {
      currentTask.subtasks.push(newSubtask);

      const subtaskList = document.querySelector(".subtask-list");
      if (subtaskList) {
        subtaskList.innerHTML += generateSubtasksHTML([newSubtask]);
      }
    }
  }
}
