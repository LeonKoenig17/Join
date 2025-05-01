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

function confirmSubtaskEntry() {
    const subInput = document.getElementById("subtask-input");
    if (!subInput) return;

    const val = subInput.value.trim();
    if (val) {
        subtasks.push({ name: val, completed: false });
        updateSubtaskList(subtasks);
    }
    initSubtaskUI(); 
}

function getTaskById(taskId) {
    return tasks.find(task => task.id === taskId); // tasks ist ein globales Array mit allen Tasks
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

    const addMode = isAddMode();

    list.innerHTML = subtasks
      .map((s, i) => {
        return addMode
          ? subtasksTemplate(s, i)
          : taskOverlaySubtaskTemplate(s, i);
      })
      .join('');
  }

  function editSubtask(index) {
    const subtaskItems = document.querySelectorAll(".subtask-item");
    const subtaskItem = subtaskItems[index];
    if (!subtaskItem) return;
  
    const subtaskText = subtaskItem.querySelector(".subtask-text");
    const subtaskIcons = subtaskItem.querySelector(".subtask-icons");
  
    subtaskItem.classList.add("editing");
  
    subtaskText.innerHTML = `
      <input type="text" class="edit-input" value="${subtasks[index].name}" 
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

function saveSubtask(index) {
  const subtaskItem = document.querySelector(`.subtask-item[data-subtask-index="${index}"]`);
  if (!subtaskItem) return;

  const input = subtaskItem.querySelector(".edit-input");
  if (!input) return;

  const newValue = input.value.trim();
  if (!newValue || !subtasks[index]) return;

  subtasks[index].name = newValue;
  subtaskItem.classList.remove("editing");

  updateSubtaskList(); // neu rendern
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
    });
  }


  document.addEventListener("DOMContentLoaded", () => {
    initSubtaskUI();
    setupSubtaskListeners();
    checkSubtaskClass(); // data delegation für delete und edit
  });