let currentTask = null;
let isEditing = false;

function showTaskOverlay(taskData) {
  loadFirebaseUsers().then(users => {
    checkUserColor(taskData, users);
    initSubtasksArray(taskData);
    currentTask = taskData;
    const overlayHTML = generateTaskOverlay(taskData);
    document.body.insertAdjacentHTML("beforeend", overlayHTML);
    updateSubtaskList();
    setTimeout(() => document.getElementById("taskOverlay").style.display = "flex", 0);
  });
}

function showAddTaskOverlay() {
  renderAddTaskOverlay();
  initOverlayPriority();
  initializeOverlayFeatures();
  setupTaskForm();
}

async function showEditTaskOverlay(taskId) {
  try {
    if (document.getElementById('taskOverlay')) closeOverlay(true);

    let taskData = currentTask && currentTask.id === taskId ? currentTask : null;
    if (!taskData) {
      const all = await loadData('tasks');
      const raw = all[taskId];
      if (!raw) throw new Error('Task not found');
      taskData = { id: taskId, ...raw };
    }

    if (!taskData.subtasks) {
      taskData.subtasks = [];
    }

    const users = await loadFirebaseUsers();
    const overlayHTML = editTaskOverlayTemplate(taskData, users);
    document.body.insertAdjacentHTML('beforeend', overlayHTML);
    initOverlayPriority();
    
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

function closeOverlay(force = false) {
  const overlay = document.getElementById("taskOverlay");
  if (overlay) overlay.remove();
  currentTask = null;
  isEditing = false;
}

function handleOverlayClick(event) {
  if (event.target.id === "taskOverlay") closeOverlay();
}
