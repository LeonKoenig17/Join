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
  const titleEl = document.getElementById("title");
  if (titleEl) titleEl.value = "";

  const descEl = document.getElementById("description");
  if (descEl) descEl.value = "";

  const dateEl = document.getElementById("due-date");
  if (dateEl) dateEl.value = "";

  priorityButtons.forEach(btn => btn.classList.remove("active-btn"));

  const assignedChips = document.getElementById("assignedChips");
  if (assignedChips) assignedChips.innerHTML = "";

  const categoryEl = document.getElementById("categorySelect");
  if (categoryEl) categoryEl.selectedIndex = 0;

  clearFieldErrors();
  updateSubtaskList();
}


function clearFieldErrors() {
  ["title-error", "description-error", "due-date-error", "category-error"].forEach(id => {
    const err = document.getElementById(id);
    if (err) err.textContent = "";
  });

  ["title", "description", "due-date", "categorySelect"].forEach(id => {
    const field = document.getElementById(id);
    if (field) field.classList.remove("fieldIsRequired");
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