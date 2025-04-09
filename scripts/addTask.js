// Alle globalen Variablen und DOM-Elemente
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("due-date");
const pickerIcon = document.querySelector(".custom-date-input img");
const priorityButtons = document.querySelectorAll(
  ".priority-buttons .priority"
);
const assignedToSelect = document.getElementById("assignedDropdownSelected");
const categorySelect = document.getElementById("categorySelect");
const subtaskInput = document.getElementById("subtaskInput");
const addSubtaskBtn = document.querySelector(".add-subtask");
const createTaskBtn = document.querySelector(".create-button");

let subtasks = [];
let subtaskList = document.getElementById("subtask-list");
if (!subtaskList) {
  document.querySelector(".subtask-input").innerHTML +=
    "<div id='subtask-list'></div>";
  subtaskList = document.getElementById("subtask-list");
}

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
  setupSubtaskInput();
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
  try {
    await postData("tasks", data);
    clearForm();
    window.location.href = "board.html"; // Weiterleitung zur board.html
  } catch (err) {
    console.error("Fehler:", err);
  }
}

/**
 * Initializes the subtask input functionality by setting up event listeners
 * for the subtask input field and the add subtask button. This function:
 * - Enables or disables the add subtask button based on the input field's value.
 * - Adds a new subtask to the list when the add button is clicked, updates the
 *   subtask list, clears the input field, and disables the button.
 *
 * @function setupSubtaskInput
 * @listens input#subtaskInput - Monitors changes in the subtask input field.
 * @listens click#addSubtaskBtn - Handles adding a new subtask when the button is clicked.
 */
function setupSubtaskInput() {
  subtaskInput.addEventListener("input", function () {
    addSubtaskBtn.disabled = subtaskInput.value.trim() === "";
  });
  addSubtaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
    const text = subtaskInput.value.trim();
    if (text !== "") {
      subtasks.push(text);
      updateSubtaskList();
      subtaskInput.value = "";
      addSubtaskBtn.disabled = true;
    }
  });
}

/**
 * Updates the subtask list in the DOM by generating HTML for each subtask
 * and attaching event listeners to delete buttons for removing subtasks.
 *
 * The function iterates over the `subtasks` array to create the HTML structure
 * for the subtask list using the `subtaskTemplate` function. It then assigns
 * the generated HTML to the `subtaskList` element. Additionally, it adds
 * click event listeners to the delete buttons, allowing users to remove
 * subtasks from the list and updates the DOM accordingly.
 *
 * @global {Array} subtasks - The array containing all subtasks.
 * @global {HTMLElement} subtaskList - The DOM element where the subtasks are rendered.
 */
function updateSubtaskList() {
  let html = "";
  for (let i = 0; i < subtasks.length; i++) {
    html += subtaskTemplate(subtasks[i], i);
  }
  subtaskList.innerHTML = html;
  const btns = subtaskList.getElementsByClassName("delete-subtask");
  for (let j = 0; j < btns.length; j++) {
    btns[j].addEventListener("click", function () {
      const index = parseInt(this.getAttribute("data-index"), 10);
      let newSubs = [];
      for (let k = 0; k < subtasks.length; k++) {
        if (k !== index) {
          newSubs.push(subtasks[k]);
        }
      }
      subtasks = newSubs;
      updateSubtaskList();
    });
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
        field.nextElementSibling.textContent = ""; // Clear error message
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
    // Entferne die rote Border (über die CSS-Klasse)
    dateInput.classList.remove("fieldIsRequired");

    // Entferne die Fehlermeldung
    document.getElementById("due-date-error").textContent = "";

    // Setze den Border direkt auf blau zurück (falls du es direkt überschreiben möchtest)
    dateInput.style.borderColor = "var(--border-color)";
  }
});

/**
 * Clears the task form by resetting all input fields, selections, and states.
 * - Resets the title and description input fields to empty strings.
 * - Clears the date input field.
 * - Removes the "active-btn" class from all priority buttons and sets the second button as active if it exists.
 * - Resets the "Assigned To" and "Category" dropdowns to their default selections if they exist.
 * - Empties the subtasks array and updates the subtask list display.
 */
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
  subtasks = [];
  updateSubtaskList();
}


/**
 * Sets up the event listener for the "Create Task" button.
 * When the button is clicked, it prevents the default form submission
 * behavior and triggers the `createTask` function.
 */
function setupCreateTaskButton() {
  createTaskBtn.addEventListener("click", function (e) {
    e.preventDefault();
    createTask();
  });
}

/**
 * Updates an existing task with new data.
 *
 * @async
 * @function
 * @param {string} taskId - The unique identifier of the task to be updated.
 * @param {Object} updatedTask - An object containing the updated task data.
 * @returns {Promise<void>} Resolves when the task is successfully updated.
 * @throws {Error} If an error occurs during the update process.
 */
async function updateTask(taskId, updatedTask) {
  try {
    await updateData("tasks/" + taskId, updatedTask);
    console.log("Task updated");
  } catch (err) {
    console.error("Error updating task:", err);
  }
}

/**
 * Asynchronously removes a task by its ID.
 *
 * This function deletes a task from the data source using the provided task ID.
 * If the deletion is successful, a confirmation message is logged to the console.
 * If an error occurs during the deletion process, it is caught and logged as an error.
 *
 * @async
 * @function
 * @param {string} taskId - The unique identifier of the task to be removed.
 * @returns {Promise<void>} A promise that resolves when the task is successfully deleted.
 * @throws {Error} Logs an error message if the task deletion fails.
 */
async function removeTask(taskId) {
  try {
    await deleteData("tasks/" + taskId);
    console.log("Task deleted");
  } catch (err) {
    console.error("Error deleting task:", err);
  }
}

/**
 * A reference to the HTML input element for selecting a due date.
 * This element is expected to have the ID 'due-date'.
 *
 * @type {HTMLInputElement | null}
 */
document
  .querySelector(".custom-date-input img")
  .addEventListener("click", () => {
    dateInput.showPicker ? dateInput.showPicker() : dateInput.focus();
  });

/**
 * Generates the initials from a given name.
 *
 * @param {string} name - The full name from which to extract initials.
 *                        If the name is empty or undefined, "NN" (No Name) is returned.
 * @returns {string} The initials derived from the name. If the name contains only one word,
 *                   the first letter of that word is returned in uppercase.
 *                   If the name contains multiple words, the first letter of the first
 *                   and last words are returned in uppercase.
 */
function getInitials(name) {
  if (!name) return "NN"; // "No Name"
  const parts = name.trim().split(" ");
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  } else {
    const first = parts[0].charAt(0).toUpperCase();
    const last = parts[parts.length - 1].charAt(0).toUpperCase();
    return first + last;
  }
}

/**
 * Asynchronously loads user data and renders assigned contacts into a dropdown element.
 *
 * This function retrieves user data from storage using the key "login", then dynamically
 * populates the HTML element with the ID "assignedDropdownSelected" with user information.
 * If the target element is not found, an error is logged to the console.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the user data is loaded and rendered.
 * @throws {Error} Logs an error if the target element is not found.
 */
async function loadAndRenderAssignedContacts() {
  const users = await loadData("login");
  const assignedEl = document.getElementById("assignedDropdownSelected");
  if (!assignedEl) {
    console.error("Element with id 'assignedDropdownSelected' not found!");
    return;
  }
  if (users) {
    const keys = Object.keys(users);
    for (let i = 0; i < keys.length; i++) {
      const id = keys[i],
        user = users[id];
      assignedEl.innerHTML += assignedUserTemplate(user, i);
    }
  }
}
