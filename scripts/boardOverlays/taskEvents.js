function setupTaskForm() {
    const taskForm = document.getElementById("taskForm");
    if (!taskForm) return;
    taskForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const data = getFormData();
      if (!data || !validateFormData(data)) return;
      createTask();
    });
  }
  
  function confirmDeleteTask(event, taskId) {
    event.stopPropagation();
    if (!window.confirm("Delete permanently?")) return;
    deleteTask(taskId);
  }
  
  function initPriorityButtons() {
    const buttons = document.querySelectorAll(".priority-buttons .priority");
    buttons.forEach(button => {
      button.addEventListener("click", () => setPriority(button));
    });
  }