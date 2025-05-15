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


async function showEditTaskOverlay(taskId) {
  try {
    closeOverlay();

    let taskData = currentTask && currentTask.id === taskId ? currentTask : null;
    if (!taskData) {
      const allTasks = await loadData('tasks');
      const raw = allTasks[taskId];
      if (!raw) throw new Error('Task not found');
      taskData = { id: taskId, ...raw };
    }

    if (!taskData.subtasks) taskData.subtasks = [];

    const users = await loadFirebaseUsers();
    const overlayHTML = editTaskOverlayTemplate(taskData, users);
    const container = document.getElementById("taskOverlay");

    if (container) {
      container.innerHTML = overlayHTML;
      container.classList.remove("d-none");
      container.style.display = "flex";
    }

    initPriorityButtons(document.getElementById("taskOverlay"));
    setTimeout(() => {
      renderDropdownOptions(users, taskData.assignedTo || []);
      updateAssignedChips(users);
      setupDropdownEventListeners(users);
    }, 50);

    initializeOverlayFeatures();
    currentTask = taskData;
    initializeSubtaskModule(taskData);

    document.getElementById('save-task-btn').addEventListener('click', async () => {
      const data = getFormData();
      if (!validateFormData(data)) return;

      try {
        await patchTask(taskData.id, {
          ...data,
          subtasks: subtasks.map(s => ({ name: s.name, completed: s.completed })),
        });
        closeOverlay();
        window.location.reload();
      } catch (error) {
        console.error('Error saving task:', error);
        alert('An error occurred while saving the task. Please try again.');
      }
    });
  } catch (err) {
    console.error('Error in edit overlay:', err);
  }
}


function closeOverlay() {
  const container = document.getElementById("taskOverlay");
  if (container) {
    container.innerHTML = "";
    container.classList.add("d-none");
    container.style.display = "none";
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

