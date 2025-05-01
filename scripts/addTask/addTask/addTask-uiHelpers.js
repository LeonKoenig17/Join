function setupFieldListeners() {
    const fields = [titleInput, dateInput, categorySelect];
    fields.forEach((field) => {
      let clicked = false;
      field.addEventListener("focus", () => (clicked = true));
      field.addEventListener("blur", () => {
        if (!field.value.trim()) field.classList.add("fieldIsRequired");
        else field.classList.remove("fieldIsRequired");
      });
      field.addEventListener("focus", () => {
        if (clicked) field.classList.remove("fieldIsRequired");
      });
    });
  }
  
  function fillDescription() {
    descriptionInput.addEventListener("click", () => {
      descriptionInput.value = "Create a contact form and imprint page.";
    });
  }
  
 function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  dateInput.value = "";

  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].classList.remove("active-btn");
  }

  if (assignedToSelect) {
    assignedToSelect.selectedIndex = -1;
  }
  if (categorySelect) {
    categorySelect.selectedIndex = 0;
  }

  clearFieldErrors();
  updateSubtaskList();
}

function clearFieldErrors() {
    document.getElementById("title-error").textContent = "";
    document.getElementById("description-error").textContent = "";
    document.getElementById("due-date-error").textContent = "";
    document.getElementById("category-error").textContent = "";
  
    const inputFields = [titleInput, descriptionInput, dateInput, categorySelect];
    inputFields.forEach((field) => {
      field.classList.remove("fieldIsRequired");
    });
  }

  function setPriority(button) {
    activePriorityButton = button;
    priorityButtons.forEach(btn => btn.classList.remove('active-btn'));
    button.classList.add('active-btn');
  }
  
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.priority-buttons')) {
      if (activePriorityButton) {
        priorityButtons.forEach(btn => btn.classList.remove('active-btn'));
        activePriorityButton.classList.add('active-btn');
      }
    }
  });