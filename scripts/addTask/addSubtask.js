function initSubtaskUI() {
    const subInput = document.getElementById("subtask-input");
    const addIcon = document.getElementById("add-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const seperator = document.getElementById("seperator");

    if (!subInput || !addIcon || !checkIcon || !closeIcon || !seperator) return;

    subInput.value = "";
    toggleIcons(false);
}

function toggleIcons(isActive) {
    const addIcon = document.getElementById("add-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const seperator = document.getElementById("seperator");

    if (!addIcon || !checkIcon || !closeIcon || !seperator) return;

    addIcon.classList.toggle("d-none", isActive);
    checkIcon.classList.toggle("d-none", !isActive);
    closeIcon.classList.toggle("d-none", !isActive);
    seperator.classList.toggle("d-none", !isActive);
}

function activateSubtaskInput() {
    const subInput = document.getElementById("subtask-input");
    if (!subInput) return;

    subInput.value = "Contact Form";
    subInput.style.color = "#000000";
    toggleIcons(true);
    subInput.focus();
}

function cancelSubtaskEntry() {
    initSubtaskUI();
}

function isAddMode() {
    // Prüfen, ob wir uns auf der Add-Task-Seite befinden
    return document.body.classList.contains('add-task-page') || window.location.pathname.includes('addTask.html');
}

function confirmSubtaskEntry() {
    const subInput = document.getElementById("subtask-input");
    if (!subInput) return;

    const val = subInput.value.trim();
    if (val) {
        subtasks.push({ name: val, completed: false }); // Subtask hinzufügen
        updateSubtaskList(subtasks); // Subtask-Liste aktualisieren
    }
    initSubtaskUI(); // UI zurücksetzen
}

function getTaskById(taskId) {
    return tasks.find(task => task.id === taskId); // tasks ist ein globales Array mit allen Tasks
  }

  function isAddMode() {
    const overlay = document.getElementById('taskOverlay');
    if (overlay && overlay.classList.contains('add-task-page')) {
      return true; // Add-Task-Seite
    }
    return document.body.classList.contains('add-task-page') || window.location.pathname.includes('addTask.html');
  }

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

function editSubtask(index) {
    const subtaskItems = document.querySelectorAll(".subtask-item");
    if (!subtaskItems[index]) return;

    const subtaskItem = subtaskItems[index];
    const subtaskText = subtaskItem.querySelector(".subtask-text");
    const subtaskIcons = subtaskItem.querySelector(".subtask-icons");

    subtaskItem.classList.add("editing");
    subtaskText.innerHTML = `<input type="text" class="edit-input" value="${subtasks[index].name}" onkeypress="handleEditKeyPress(event, ${index})">`;
    subtaskIcons.innerHTML = `
        <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
        <img src="../images/checkDark.svg" alt="Save" class="subtask-icon save-icon" onclick="saveSubtask(${index})">
    `;
    subtaskText.querySelector(".edit-input").focus();
}

function saveSubtask(index) {
    const input = document.querySelector(".edit-input");
    if (!input) return;

    const newValue = input.value.trim();
    if (newValue) {
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
    const addIcon   = document.getElementById("add-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const subInput  = document.getElementById("subtask-input");
    if (!addIcon || !closeIcon || !checkIcon || !subInput) return;

    addIcon.addEventListener("click", () => {
        if (subInput.value.trim() !== "") {
            confirmSubtaskEntry();
        } else {
            activateSubtaskInput();
        }
    });
    closeIcon.addEventListener("click", cancelSubtaskEntry);
    checkIcon.addEventListener("click", confirmSubtaskEntry);
    subInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            confirmSubtaskEntry();
        }
    });
}
document.addEventListener("DOMContentLoaded", () => {
    initSubtaskUI();
    setupSubtaskListeners();
});
