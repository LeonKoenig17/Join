function getFormData() {
  const elements = getFormElements();
  if (!validateFormElements(elements)) return null;
  const { title, description, dueDate, category } = getFormValues(elements);
  return {
    title,
    description,
    dueDate,
    priority:   getActivePriority(),
    assignedTo: getAssignedContacts(),
    category,
    subtasks:   getSubtasksData()
  };
}
  
  function getFormElements() {
    return {
      titleInput: document.getElementById("title"),
      descriptionInput: document.getElementById("description"),
      dateInput: document.getElementById("due-date"),
      categorySelect: document.getElementById("categorySelect"),
      priorityButtons: document.querySelectorAll(".priority-buttons .priority"),
    };
  }
  
 function getFormValues(elements) {
  const { titleInput, descriptionInput, dateInput, categorySelect } = elements;
  return {
    title:       titleInput.value.trim(),
    description: descriptionInput.value.trim(),
    dueDate:     dateInput.value.trim(),
    category:    categorySelect.value
  };
}
  
  function getActivePriority() {
    const priorityButtons = document.querySelectorAll(".priority-buttons .priority");
    for (let i = 0; i < priorityButtons.length; i++) {
      if (priorityButtons[i].classList.contains("active-btn")) {
        return priorityButtons[i].textContent.trim();
      }
    }
    return "";
  }
  
  function getSubtasksData() {
    return subtasks.map((subtask) => ({
      name: subtask.name,
      completed: false,
    }));
  }
  