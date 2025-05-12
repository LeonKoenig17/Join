async function createTask(stage) {
    const data = getFormData();
    if (!validateFormData(data)) return;
  

    const stageMap = { todo: 0, inProgress: 1, awaitFeedback: 2, done: 3 };
    data.stage     = stageMap[stage] ?? 0;
    data.taskIndex = Date.now();
   
  
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