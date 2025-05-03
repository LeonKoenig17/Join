async function createTask() {
    const data = getFormData();
    if (!validateFormData(data)) return;
  
    data.taskIndex = Date.now();
    data.stage = 0;
  
    try {
      await postData("tasks", data);
      clearForm();
      window.location.href = "board.html";
    } catch (err) {
      console.error("Fehler:", err);
    }
    closeOverlay(true);
  }
  
  function getSanitizedSubtasks() {
    const result = [];
    for (let s of subtasks) {
      result.push({
        name: s.name.trim(),
        completed: !!s.completed
      });
    }
    return result;
  }
  

  async function saveTask(taskId) {
    const data = getFormData();
    if (!validateFormData(data)) return;
  
    const updatedTask = {
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      priority: data.priority,
      category: data.category,
      assignedTo: data.assignedTo,
      subtasks: getSanitizedSubtasks(),
      stage: currentTask.stage,
      taskIndex: currentTask.taskIndex
    };
  
    try {
      await patchTask(taskId, updatedTask);
      closeOverlay();
      await fetchData();
      await renderLists();
      highlightTask(updatedTask.taskIndex);
      showToast("Task gespeichert");
    } catch (error) {
      console.error("Fehler beim Speichern:", error);
      showToast("Fehler beim Speichern");
    }
  }