let priorityButtons = [];

function setupFieldListeners() {
  const titleInput       = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const dateInput        = document.getElementById("due-date");
  const categorySelect   = document.getElementById("categorySelect");

  const fields = [titleInput, descriptionInput, dateInput, categorySelect].filter(Boolean);

  fields.forEach(field => {
    field.addEventListener("focus", () => {
      field.classList.remove("fieldIsRequired");
    });
    field.addEventListener("blur", () => {
      if (!field.value.trim()) {
        field.classList.add("fieldIsRequired");
      } else {
        field.classList.remove("fieldIsRequired");
      }
    });
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

  function initOverlayPriority() {
    const root = document.getElementById('taskOverlay') || document;
    priorityButtons = root.querySelectorAll('.priority-buttons .priority');
    activePriorityButton = root.querySelector('.priority.active-btn');

    priorityButtons.forEach(btn =>
      btn.addEventListener('click', () => setPriority(btn))
    );
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