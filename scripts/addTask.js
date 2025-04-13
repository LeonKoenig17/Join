const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("due-date");
const pickerIcon = document.querySelector(".custom-date-input img");
const priorityButtons = document.querySelectorAll(
  ".priority-buttons .priority"
);
const assignedToSelect = document.getElementById("assignedDropdownSelected");
const categorySelect = document.getElementById("categorySelect");

/**
 * Initializes the task creation page by setting up various UI components and functionalities.
 * - Configures the date picker for task deadlines.
 * - Sets up priority buttons for task prioritization.
 * - Loads and renders the list of contacts to assign tasks.
 * - Configures the input for adding subtasks.
 * - Sets up the button to create a new task.
 */
function init() {
  setupDatePicker();
  setupPriorityButtons();
  loadAndRenderAssignedContacts();
  applyUserColors();
  setupCreateTaskButton();
  setupFieldListeners();
}

/**
 * Sets up a date picker functionality by adding an event listener to the picker icon.
 * When the picker icon is clicked, it either shows the date picker (if supported)
 * or focuses on the date input field as a fallback.
 *
 * @function
 * @throws {TypeError} If `pickerIcon` or `dateInput` is not defined.
 */
function setupDatePicker() {
  pickerIcon.addEventListener("click", function () {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}

/**
 * Sets up event listeners for priority buttons to handle their active state.
 * When a button is clicked, it removes the "active-btn" class from all buttons
 * and adds it to the clicked button, ensuring only one button is active at a time.
 *
 * @function
 * @returns {void}
 */
function setupPriorityButtons() {
  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].addEventListener("click", function () {
      for (let j = 0; j < priorityButtons.length; j++) {
        priorityButtons[j].classList.remove("active-btn");
      }
      this.classList.add("active-btn");
    });
  }
}

async function createTask() {
  const data = getFormData();
  if (!validateFormData(data)) {
    return;
  }

  data.taskIndex = Date.now();
  data.stage = 0;

  try {
    await postData("tasks", data);
    clearForm();
    window.location.href = "board.html";
  } catch (err) {
    console.error("Fehler:", err);
  }
}

/**
 * Retrieves and organizes form data into an object.
 *
 * @returns {Object} An object containing the following properties:
 * - {string} title - The trimmed value of the title input field.
 * - {string} description - The trimmed value of the description input field.
 * - {string} dueDate - The selected due date from the date input field.
 * - {string} priority - The priority level determined by the active button.
 * - {Array} assignedTo - The list of assigned contacts retrieved from `getAssignedContacts()`.
 * - {string} category - The selected category from the category dropdown.
 * - {Array} subtasks - The list of subtasks.
 */
function getFormData() {
  const title = document.getElementById("title").value.trim();
  const description = document.getElementById("description").value.trim();
  const dueDate = dateInput.value;
  let priority = "";
  for (let i = 0; i < priorityButtons.length; i++) {
    if (priorityButtons[i].classList.contains("active-btn")) {
      priority = priorityButtons[i].textContent.trim();
      break;
    }
  }
  return {
    title,
    description,
    dueDate,
    priority,
    assignedTo: getAssignedContacts(),
    category: categorySelect.value,
    subtasks,
  };
}

function validateFormData(data) {
  let isValid = true;

  if (!data.title) {
    titleInput.classList.add("fieldIsRequired");
    document.getElementById("title-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    titleInput.classList.remove("fieldIsRequired");
    document.getElementById("title-error").textContent = "";
  }

  if (!data.description) {
    descriptionInput.classList.add("fieldIsRequired");
    document.getElementById("description-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    descriptionInput.classList.remove("fieldIsRequired");
    document.getElementById("description-error").textContent = "";
  }

  if (!data.dueDate) {
    dateInput.classList.add("fieldIsRequired");
    document.getElementById("due-date-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    dateInput.classList.remove("fieldIsRequired");
    document.getElementById("due-date-error").textContent = "";
  }

  if (!data.category || data.category === "Select task category") {
    categorySelect.classList.add("fieldIsRequired");
    document.getElementById("category-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    categorySelect.classList.remove("fieldIsRequired");
    document.getElementById("category-error").textContent = "";
  }

  return isValid;
}

function setupFieldListeners() {
  const fields = [titleInput, descriptionInput, dateInput, categorySelect];

  fields.forEach((field) => {
    field.addEventListener("blur", () => {
      if (
        (field === categorySelect && field.value === "Select task category") ||
        field.value.trim() === ""
      ) {
        field.classList.add("fieldIsRequired");
      } else {
        field.classList.remove("fieldIsRequired");
        field.nextElementSibling.textContent = "";
      }
    });
  });
}

document.getElementById("description").addEventListener("click", function () {
  document.getElementById("category-error").textContent = "";
  this.textContent = "Create a contact form and imprint page.";
});

dateInput.addEventListener("change", function () {
  if (dateInput.value) {
    dateInput.classList.remove("fieldIsRequired");

    document.getElementById("due-date-error").textContent = "";

    dateInput.style.borderColor = "var(--border-color)";
  }
});


function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  dateInput.value = "";

  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].classList.remove("active-btn");
  }
  if (priorityButtons[1]) {
    priorityButtons[1].classList.add("active-btn");
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

function setupCreateTaskButton() {
  const createTaskBtn = document.querySelector(".create-button");
  createTaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
  });
}