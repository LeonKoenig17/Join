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
    initSubtaskUI();
    updateSubtaskList();
    updateProgressBar();
  }
  
  function updateProgressBar() {
    if (!currentTask || typeof currentTask.taskIndex === 'undefined') {
      return;
    }

    const done  = subtasks.filter(s => s.completed).length;
    const total = subtasks.length;
    const pct   = total > 0 ? (done / total) * 100 : 0;

    const taskEl = document.getElementById(`task${currentTask.taskIndex}`);
    if (!taskEl) {
      return;
    }
 
    const progContainer = taskEl.querySelector('.subtask-progress-container');
    if (progContainer) {
      const bar = progContainer.querySelector('.subtask-progress-bar');
      if (bar) {
        bar.style.width = `${pct}%`;
      }
    }

    const label = taskEl.querySelector('.subtask-count');
    if (label) {
      label.textContent = `${done}/${total} Subtasks`;
    }
  
    taskEl.classList.toggle('all-done', done === total && total > 0);
    taskEl.classList.toggle('not-done', done !== total);
  }
  
  
  async function toggleSubtaskCompletion(index) {
    subtasks[index].completed = !subtasks[index].completed;
    updateSubtaskList();
    updateProgressBar();
    const updatedSubtasks = subtasks.map(s => ({ name: s.name, completed: s.completed }));
    await patchTask(currentTask.id, { subtasks: updatedSubtasks });
  }