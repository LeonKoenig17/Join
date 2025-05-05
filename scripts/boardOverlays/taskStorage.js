async function deleteTask(taskId) {
    await fetch(BASE_URL + `tasks/${taskId}.json`, { method: "DELETE" });
    closeOverlay();
    window.location.reload();
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