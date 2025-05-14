/**
 * subtask.js - Verwalten von Subtasks (Checkbox-Logik, UI, ProgressBar)
 */

const subtasks = [];

function initSubtasksArray(taskData) {
  subtasks.length = 0;
  if (!Array.isArray(taskData.subtasks)) return;
  for (let i = 0; i < taskData.subtasks.length; i++) {
    const s = taskData.subtasks[i];
    subtasks.push({ name: s.name, completed: s.completed });
  }
}

function initializeSubtaskModule(taskData) {
  initSubtasksArray(taskData);
  /*initSubtaskUI();*/
  updateSubtaskList();
  updateProgressBar();
}

function isEditMode() {
    const overlay = document.getElementById('taskOverlay');
    return overlay?.querySelector('.add-task-card')?.classList.contains('edit-mode');
}

function isAddMode() {
    const overlay = document.getElementById('taskOverlay');
    return overlay?.classList.contains('add-task-page') || 
           document.body.classList.contains('add-task-page') || 
           window.location.pathname.includes('addTask.html');
}


function updateSubtaskList() {
    const list = document.getElementById('subtask-list');
  if (!list) return;

  const editMode = isEditMode();
  const addMode = isAddMode();

  list.innerHTML = subtasks
    .map((s, i) =>
      addMode || editMode
        ? subtasksTemplate(s, i)
        : taskOverlaySubtaskTemplate(s, i)
    )
    .join("");

  const done = subtasks.filter((s) => s.completed).length;
  const total = subtasks.length;

  const subtaskCountSpan = document.querySelector(".subtask-count");
  if (subtaskCountSpan) {
    subtaskCountSpan.textContent = `${done}/${total} Subtasks`;
    subtaskCountSpan.classList.toggle("all-done", done === total && total > 0);
    subtaskCountSpan.classList.toggle("not-done", done !== total);
  }
  
}

function updateProgressBar() {
  if (!currentTask?.id) return;

  const done = subtasks.filter(s => s.completed).length;
  const total = subtasks.length;
  const pct = total > 0 ? (done / total) * 100 : 0;

  const taskEl = document.getElementById(`task${currentTask.id}`);
  if (!taskEl) return;

  const progContainer = taskEl.querySelector('.subtask-progress-container');
  if (progContainer) {
    const bar = progContainer.querySelector('.subtask-progress-bar');
    if (bar) bar.style.width = `${pct}%`;
  }

  const label = taskEl.querySelector('.subtask-count');
  if (label) {
    label.textContent = `${done}/${total} Subtasks`;
    label.classList.toggle('all-done', done === total && total > 0);
    label.classList.toggle('not-done', done !== total);
  }

  taskEl.classList.toggle('all-done', done === total && total > 0);
  taskEl.classList.toggle('not-done', done !== total);
}

async function toggleSubtaskCompletion(index) {
  subtasks[index].completed = !subtasks[index].completed;
  updateSubtaskList();
  updateProgressBar();

  if (currentTask?.id) {
    const updatedSubtasks = subtasks.map(s => ({ name: s.name, completed: s.completed }));
    await patchTask(currentTask.id, { subtasks: updatedSubtasks });
  }
}

function editSubtask(index) {
  const subtaskItems = document.querySelectorAll(".subtask-item");
  const subtaskItem = subtaskItems[index];
  if (!subtaskItem) return;

  const subtaskText = subtaskItem.querySelector(".subtask-text");
  const subtaskIcons = subtaskItem.querySelector(".subtask-icons");

  subtaskItem.classList.add("editing");

  subtaskText.innerHTML = `
      <input type="text" class="edit-input" maxlength="40" value="${subtasks[index].name}" 
         data-index="${index}" onkeypress="handleEditKeyPress(event, ${index})">
    `;

  subtaskIcons.innerHTML = `
      <img src="../images/subtaskBin.svg" alt="Delete" 
           class="subtask-icon delete-subtask" data-index="${index}">
      <img src="../images/checkDark.svg" alt="Save" 
           class="subtask-icon confirm-subtask" data-index="${index}">
    `;

  subtaskText.querySelector(".edit-input").focus();
}


function handleEditKeyPress(event, index) {

  if (event.key === "Enter") {
    saveSubtask(index);
  }
}

async function saveSubtask(index) {
  const subtaskItem = document.querySelector(
    `.subtask-item[data-subtask-index="${index}"]`
  );
  if (!subtaskItem) return;

  const input = subtaskItem.querySelector(".edit-input");
  if (!input) return;

  const newValue = input.value.trim();
  if (!newValue || !subtasks[index]) return;

  subtasks[index].name = newValue;
  subtaskItem.classList.remove("editing");

  updateSubtaskList();

  if (currentTask?.id) {
    const updatedSubtasks = subtasks.map(s => ({ name: s.name, completed: s.completed }));
    await patchTask(currentTask.id, { subtasks: updatedSubtasks });
  }
}

async function deleteSubtask(index) {
  subtasks.splice(index, 1);
  updateSubtaskList();

  // ⬇ Backend speichern
  if (currentTask?.id) {
    const updatedSubtasks = subtasks.map(s => ({ name: s.name, completed: s.completed }));
    await patchTask(currentTask.id, { subtasks: updatedSubtasks });
  }
}

function setupSubtaskListeners() {
  const addIcon = document.getElementById("add-icon");
  const closeIcon = document.getElementById("close-subtask-icon");
  const checkIcon = document.getElementById("check-subtask-icon");
  const subInput = document.getElementById("subtask-input");
  if (!addIcon || !subInput) return;

  addIcon.addEventListener("click", () => {
    if (subInput.value.trim() !== "") {
      confirmSubtaskEntry();
    } else {
      activateSubtaskInput();
    }
  });

  subInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      confirmSubtaskEntry();
    }
  });
}

function checkSubtaskClass() {
  document.addEventListener("click", function (e) {
    if (e.target.classList.contains("edit-subtask")) {
      const index = +e.target.dataset.index;
      editSubtask(index);
    }

    if (e.target.classList.contains("delete-subtask")) {
      const index = +e.target.dataset.index;
      deleteSubtask(index);
    }

    if (e.target.classList.contains("confirm-subtask")) {
      const index = +e.target.dataset.index;
      saveSubtask(index);
    }
    if (e.target.id === "close-subtask-icon") {
      toggleIcons();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupSubtaskListeners();
  checkSubtaskClass();
});

function activateSubtaskInput() {
  const subInput = document.getElementById("subtask-input");
  if (!subInput) return;

  subInput.style.color = "#000000";
  toggleIcons(true);
  subInput.focus();
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


function confirmSubtaskEntry() {
  const subInput = document.getElementById("subtask-input");
  if (!subInput) return;

  const val = subInput.value.trim();
  if (val) {
    subtasks.push({ name: val, completed: false });
    updateSubtaskList();
  }
}