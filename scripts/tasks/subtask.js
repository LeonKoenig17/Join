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


function updateSubtaskList(taskId) {
    const list = document.getElementById('subtask-list');
    if (!list) return;

    const subtasksHTML = generateSubtasksHTML();
    list.innerHTML = subtasksHTML;

    const { done, total } = calculateSubtaskProgress();
    updateSubtaskCount(taskId, done, total);
}

function generateSubtasksHTML() {
    const editMode = isEditMode();
    const addMode = isAddMode();
    return subtasks
        .map((s, i) => (addMode || editMode ? subtasksTemplate(s, i) : taskOverlaySubtaskTemplate(s, i)))
        .join("");
}

function calculateSubtaskProgress() {
    const done = subtasks.filter((s) => s.completed).length;
    const total = subtasks.length;
    return { done, total };
}

function updateSubtaskCount(taskId, done, total) {
    const subtaskCountSpan = document.querySelector(`#task${taskId} .subtask-count`);
    if (subtaskCountSpan) {
        subtaskCountSpan.textContent = `${done}/${total} Subtasks`;
        subtaskCountSpan.classList.toggle("all-done", done === total && total > 0);
        subtaskCountSpan.classList.toggle("not-done", done !== total);
    }
}

/**
 * Normalisiert task.subtasks und berechnet Count + Progress.
 * @param {Object} task
 * @returns {{completedSubtasks: number, totalSubtasks: number, progressPercentage: number}}
 */
function checkSubProgress(task) {
  const subs = Array.isArray(task.subtasks)
    ? task.subtasks
    : task.subtasks && typeof task.subtasks === "object"
    ? Object.values(task.subtasks)
    : [];

  const totalSubtasks = subs.length;
  const completedSubtasks = subs.filter((s) => s.completed === true).length;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return { completedSubtasks, totalSubtasks, progressPercentage };
}


function updateProgressBar() {
    if (!currentTask?.id) return;

    const { done, total, pct } = calculateProgress();
    const taskEl = document.getElementById(`task${currentTask.id}`);
    if (!taskEl) return;

    updateProgressBarUI(taskEl, pct);
    updateTaskLabel(taskEl, done, total);
}

function calculateProgress() {
    const done = subtasks.filter(s => s.completed).length;
    const total = subtasks.length;
    const pct = total > 0 ? (done / total) * 100 : 0;
    return { done, total, pct };
}

function updateProgressBarUI(taskEl, pct) {
    const bar = taskEl.querySelector('.subtask-progress-bar');
    if (bar) bar.style.width = `${pct}%`;
}

function updateTaskLabel(taskEl, done, total) {
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
  const subtaskItem = getSubtaskItem(index);
  if (!subtaskItem) return;

  prepareSubtaskForEditing(subtaskItem, index);
  focusOnEditInput(subtaskItem);
}

function getSubtaskItem(index) {
  const subtaskItems = document.querySelectorAll(".subtask-item");
  return subtaskItems[index] || null;
}

function prepareSubtaskForEditing(subtaskItem, index) {
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
}

function focusOnEditInput(subtaskItem) {
  const editInput = subtaskItem.querySelector(".edit-input");
  if (editInput) editInput.focus();
}

function handleEditKeyPress(event, index) {

  if (event.key === "Enter") {
    saveSubtask(index);
  }
}

async function saveSubtask(index) {
    const subtaskItem = getSubtaskItemForSave(index);
    if (!subtaskItem) return;

    const newValue = getNewSubtaskValue(subtaskItem, index);
    if (!newValue) return;

    updateSubtaskName(index, newValue);
    finalizeSubtaskEditing(subtaskItem);

    await persistSubtasksIfNeeded();
}

function getSubtaskItemForSave(index) {
    return document.querySelector(`.subtask-item[data-subtask-index="${index}"]`) || null;
}

function getNewSubtaskValue(subtaskItem, index) {
    const input = subtaskItem.querySelector(".edit-input");
    return input ? input.value.trim() : null;
}

function updateSubtaskName(index, newValue) {
    if (subtasks[index]) subtasks[index].name = newValue;
}

function finalizeSubtaskEditing(subtaskItem) {
    subtaskItem.classList.remove("editing");
    updateSubtaskList();
}

async function persistSubtasksIfNeeded() {
    if (currentTask?.id) {
        const updatedSubtasks = subtasks.map(s => ({ name: s.name, completed: s.completed }));
        await patchTask(currentTask.id, { subtasks: updatedSubtasks });
    }
}

async function deleteSubtask(index) {
  subtasks.splice(index, 1);
  updateSubtaskList();

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
  if (!addIcon || !subInput || !closeIcon || !checkIcon) return;

  addIcon.addEventListener("click", () => {
    if (subInput.value.trim() !== "") {
      confirmSubtaskEntry();
      toggleIcons(false);
    } else {
      activateSubtaskInput();
    }
  });

 subInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    e.stopPropagation();
    confirmSubtaskEntry();
    subInput.value = "";
    toggleIcons(false);
  }
});
  
  checkIcon.addEventListener("click", () => {
    subInput.value = "";
    toggleIcons(false);
  });
}


function checkSubtaskClass() {
    document.addEventListener("click", handleSubtaskClick);
}

function handleSubtaskClick(e) {
    if (e.target.classList.contains("edit-subtask")) {
        handleEditSubtask(e);
    } else if (e.target.classList.contains("delete-subtask")) {
        handleDeleteSubtask(e);
    } else if (e.target.classList.contains("confirm-subtask")) {
        handleConfirmSubtask(e);
    } else if (e.target.id === "close-subtask-icon") {
        handleCloseSubtaskInput();
    }
}

function handleEditSubtask(e) {
    const index = +e.target.dataset.index;
    editSubtask(index);
}

function handleDeleteSubtask(e) {
    const index = +e.target.dataset.index;
    deleteSubtask(index);
}

function handleConfirmSubtask(e) {
    const index = +e.target.dataset.index;
    saveSubtask(index);
}

function handleCloseSubtaskInput() {
    toggleIcons(false);
    const subInput = document.getElementById("subtask-input");
    if (subInput) subInput.value = "";
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
    const subInput = document.getElementById("subtask-input");
      subInput.value = "";
  }
}