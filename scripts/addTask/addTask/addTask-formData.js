function getFormData() {
    const formElements = getFormElements();
    if (!validateFormElements(formElements)) return null;
  
    const { title, description, dueDate, category } = getFormValues(formElements);
    const priority = getActivePriority();
    const assignedTo = getAssignedContacts();
    const subtasksData = getSubtasksData();
  
    return {
      title,
      description,
      dueDate,
      priority,
      assignedTo,
      category,
      subtasks: subtasksData,
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
    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();
    const dueDate = dateInput.value.trim();
    const category = categorySelect.value;
  
    if (!category || category === "Select task category") {
      console.error("Die Kategorie muss ausgewählt werden.");
      return null;
    }
  
    return { title, description, dueDate, category };
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
  