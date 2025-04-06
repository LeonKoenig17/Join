// Alle globalen Variablen und DOM-Elemente
const BASE_URL =
  "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
let subtasks = [];
const dateInput = document.getElementById("due-date");
const pickerIcon = document.querySelector(".custom-date-input img");
const priorityButtons = document.querySelectorAll(".priority-buttons .priority");
const assignedToSelect = document.getElementById("assignedDropdownSelected");
const categorySelect = document.getElementById("categorySelect");
const subtaskInput = document.getElementById("subtaskInput");
const addSubtaskBtn = document.querySelector(".add-subtask");
const createTaskBtn = document.querySelector(".create-button");
const messageDiv = document.getElementById("message");
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
}


/**
 * Asynchronously loads JSON data from a specified path.
 *
 * @param {string} [path=""] - The relative path to the JSON file (excluding the ".json" extension).
 * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
 * @throws {Error} If the fetch request fails or the response cannot be parsed as JSON.
 */
async function loadData(path = "") {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}


/**
 * Sends a POST request to the specified path with the provided data.
 *
 * @async
 * @function postData
 * @param {string} path - The endpoint path to which the data will be sent (relative to the base URL).
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function postData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}

/**
 * Sends a PATCH request to update data at the specified path on the server.
 *
 * @async
 * @function
 * @param {string} [path=""] - The relative path to the resource to be updated.
 * @param {Object} [data={}] - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function updateData(path = "", data = {}) {
  const response = await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}


/**
 * Deletes data from the specified path on the server.
 *
 * @async
 * @function deleteData
 * @param {string} [path=""] - The relative path to the resource to be deleted.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success of the operation.
 *                             If the response contains JSON, it will return the parsed JSON object.
 *                             If an error occurs or no JSON is returned, it defaults to `{ success: true }`.
 */
async function deleteData(path = "") {
  const response = await fetch(BASE_URL + path + ".json", { method: "DELETE" });
  try {
    return (await response.json()) || { success: true };
  } catch (e) {
    return { success: true };
  }
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

/**
 * Asynchronously creates a new task by collecting form data, validating it, 
 * and sending it to the server. Displays appropriate messages based on the 
 * success or failure of the operation.
 *
 * @async
 * @function createTask
 * @returns {Promise<void>} Resolves when the task is successfully created or 
 * handles errors if the operation fails.
 *
 * @throws {Error} Logs and displays an error message if the task creation fails.
 */
async function createTask() {
  const data = getFormData();
  if (!validateFormData(data)) {
    showMessage("Bitte fülle alle erforderlichen Felder aus.");
    return;
  }
  try {
    await postData("tasks", data); // Speichert den Task in Firebase
    showMessage("Aufgabe wurde erfolgreich erstellt.");
    clearForm();
  } catch (err) {
    console.error("Fehler:", err);
    showMessage("Fehler beim Erstellen der Aufgabe.");
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


/**
 * Validates the provided form data to ensure all required fields are present and valid.
 *
 * @param {Object} data - The form data to validate.
 * @param {string} data.title - The title of the task.
 * @param {string} data.dueDate - The due date of the task.
 * @param {string} data.category - The category of the task.
 * @returns {boolean} Returns `true` if the form data is valid, otherwise `false`.
 */
function validateFormData(data) {
  return (
    data.title &&
    data.dueDate &&
    data.category &&
    data.category !== "Select task category"
  );
}


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
    assignedToSelect.selectedIndex = 0;
  }
  if (categorySelect) {
    categorySelect.selectedIndex = 0;
  }
  subtasks = [];
  updateSubtaskList();
}

/**
 * Displays a message by setting the inner HTML of the messageDiv element.
 *
 * @param {string} msg - The message to be displayed.
 */
function showMessage(msg) {
  messageDiv.innerHTML = msg;
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

