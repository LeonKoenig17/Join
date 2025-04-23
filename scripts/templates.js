function getInitials(str) {
  if (!str) return "?";
  if (typeof str !== "string") {
    if (str.name) return getInitials(str.name);
    if (str.email) return getInitials(str.email);
    return "?";
  }
  return str
    .split(" ")
    .map((s) => s[0].toUpperCase())
    .join("");
}

function generateAssigneeCircles(assignees) {
  return assignees
    .map((person) => {
      if (!person) return "";
      const initials = getInitials(person.name || person.email);
      return /*html*/ `
          <div class="assignee-circle" style="background-color: ${
            person.color || getRandomColor()
          }">
              ${initials}
          </div>
      `;
    })
    .join("");
}

function getRandomColor() {
  const colors = ["#FF7A00", "#FF5EB3", "#6E52FF", "#9327FF", "#00BEE8"];
  return colors[Math.floor(Math.random() * colors.length)];
}

function generateTaskCard(task) {
  const completedSubtasks = task.subtasks
    ? Object.values(task.subtasks).filter((s) => s === "ticked").length
    : 0;
  const totalSubtasks = task.subtasks ? Object.values(task.subtasks).length : 0;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return `
        <div id="task${
          task.taskIndex
        }" class="task" draggable="true" onclick="showTaskOverlay(${JSON.stringify(
    task
  ).replace(/"/g, "&quot;")})">
            <div class="task-category ${
              task.category ? task.category.toLowerCase().replace(" ", "-") : ""
            }">${task.category || ""}</div>
            <h3 class="task-title">${task.title || ""}</h3>
            <p class="task-description">${task.description || ""}</p>
            
            <div class="task-footer">
                <div class="task-subtasks">
                    <div class="subtask-progress-container">
                        <div class="subtask-progress-bar" style="width: ${progressPercentage}%"></div>
                    </div>
                    <span class="subtask-count">${completedSubtasks}/${totalSubtasks} Subtasks</span>
                </div>
                <div class="task-bottom-info">
                    <div class="task-assignees">
                        ${generateAssigneeHTML(task.assignedTo)}
                    </div>
                    <div class="task-priority ${
                      task.priority ? task.priority.toLowerCase() : ""
                    }">
                        <img src="../images/${
                          task.priority ? task.priority.toLowerCase() : "low"
                        }.svg" alt="${task.priority || "Low priority"}">
                    </div>
                </div>
            </div>
        </div>
    `;
}

function generateTaskOverlay(task) {
  // Erstelle das HTML für alle Subtasks mit deiner subtasksTemplate-Funktion
  const subtasksHTML = (task.subtasks || [])
    .map((subtask, idx) => subtasksTemplate(subtask, idx))
    .join("");

  return /*html*/ `
    <div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
      <div class="task-card">
        <div class="task-header">
          <div class="user-story-label task-category">
            ${task.category || "User Story"}
          </div>
          <button class="close-btn" onclick="closeOverlay()">
            <img src="../images/close.svg" alt="Close">
          </button>
        </div>
        <div class="task-content">
          <h2 class="task-title">${task.title || ""}</h2>
          <p class="task-description">${task.description || ""}</p>
          <div class="task-details">
            <div class="detail-row">
              <span class="detail-label">Due date:</span>
              <span class="detail-value">${task.dueDate || ""}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Priority:</span>
              <span class="priority-badge ${
                task.priority ? task.priority.toLowerCase() : ""
              }">
                ${task.priority || "Medium"}
              </span>
            </div>
            <div class="detail-row assigned-to">
              <span class="detail-label">Assigned To:</span>
              <div class="assignee-list">
                ${generateAssigneeCircles(task.assignedTo || [])}
              </div>
            </div>
          </div>
          <div class="subtasks-section">
            <span class="detail-label">Subtasks</span>
            <div class="subtask-list">
            <div id="subtask-list" class="subtask-list">
              ${subtasksHTML}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn delete-btn" onclick="deleteTask(${
            task.id
          })">
            <img src="../images/subtaskBin.svg" alt="Delete">
            <span>Delete</span>
          </button>
          <div class="action-separator"></div>
          <button class="action-btn edit-btn" onclick="editTask(${task.id})">
            <img src="../images/edit-2.svg" alt="Edit">
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function generateAssigneeHTML(assignees) {
  if (!Array.isArray(assignees)) return "";
  return assignees
    .map((person) => {
      if (!person || (!person.id && !person.userId)) return "";
      const userId = person.id || person.userId;
      const name = person.name || person.email || "?";
      const initials = getInitials(name);
      return /*html*/ `
            <div class="assignee task-assignee" 
                 data-user-id="${userId}"
                 data-user-name="${name}"
                 data-user-color="${person.color || "#A8A8A8"}">
                ${initials}
            </div>
        `;
    })
    .join("");
}

function subtasksTemplate(subtask, index) {
  return /*html*/ `
        <div class="subtask-item" data-subtask-index="${index}">
            <p class="subtask-text">• ${subtask.name}</p>
            <div class="subtask-icons">
                <img src="../images/edit-2.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${index})">
                <div class="vertical-line-subtask-dark"></div>
                <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
            </div>
        </div>
    `;
}

function assignedUserTemplate(user, index) {
  return `
        <div class="assigned-user-item">
            <div class="assigned-user-avatar-container" style="background-color: ${
              user.color
            };">
                <p class="assigned-user-avatar">${getInitials(
                  user.name || user.email
                )}</p>
            </div>
            <div class="assigned-user-details">
                <p class="assigned-user-name">${user.name || user.email}</p>
                <input
                    type="checkbox"
                    class="assign-checkbox"
                    data-user-id="${user.id}"
                    data-user-name="${user.name}"
                    data-user-email="${user.email}"
                    data-user-index="${index}"
                />
            </div>
        </div>
    `;
}

/**
 * Generates an HTML option element as a string for a given user.
 *
 * @param {Object} user - The user object containing user details.
 * @param {string} user.name - The name of the user (optional).
 * @param {string} user.email - The email of the user (used if name is not provided).
 * @param {number|string} id - The unique identifier for the user, used as the value of the option element.
 * @returns {string} An HTML string representing an option element with the user's name or email as the display text.
 */
function userOptionTemplate(user, id) {
  return (
    '<option value="' + id + '">' + (user.name || user.email) + "</option>"
  );
}

function addTaskOverlayTemplate() {
  return `
    <div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
      <div class="add-task-card ">
        <div class="task-header">
          <div class="user-story-label task-category">Add Task</div>
          <button class="close-btn" onclick="closeOverlay()"><img src="../images/close.svg" alt="close"></button>
        </div>
        <div class="task-content">
          <h1>Add Task</h1>
          <section id="addTask">
            <div class="half-width addTask-left">
              <form class="forms" id="taskForm">
                <label for="title">Title<span>*</span></label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Enter a title"
                  required
                />
                <span class="error-message" id="title-error"></span>
                <label for="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  placeholder="Enter a Description"
                  style="resize: none"
                  spellcheck="false"
                ></textarea>
                <span class="error-message" id="description-error"></span>
                <label for="due-date">Due date<span>*</span></label>
                <div class="custom-date-input">
                  <input type="date" id="due-date" name="due-date" required />
                  <img src="../images/calendar.svg" alt="Calendar Icon" />
                </div>
                <span class="error-message" id="due-date-error"></span>
              </form>
            </div>
            <div class="separator"></div>
            <div class="half-width addTask-right">
              <h3 class="h3-priority">Priority</h3>
              <div class="priority-buttons">
                <button type="button" class="priority priority-urgent" onclick="setPriority(this)">
                  Urgent
                  <img src="../images/urgent.svg" alt="Urgent" />
                </button>
                <button type="button" class="priority priority-medium active-btn" onclick="setPriority(this)">
                  Medium
                  <img src="../images/medium.svg" alt="Medium" />
                </button>
                <button type="button" class="priority priority-low" onclick="setPriority(this)">
                  Low
                  <img src="../images/low.svg" alt="Low" />
                </button>
              </div>
              <div>
                <h3>Assigned to</h3>
                <div class="custom-assigned-dropdown" id="assignedDropdown">
                  <div class="dropdown-selected" id="assignedDropdownSelected">
                    Select contacts to assign
                    <img
                      src="../images/arrow_drop_down.svg"
                      alt="Dropdown Icon"
                      class="select-icon"
                    />
                  </div>
                  <span class="error-message" id="assigned-error"></span>

                  <div
                    class="dropdown-options"
                    id="assignedDropdownOptions"
                  ></div>
                </div>
              </div>
              <div class="assigned-chips" id="assignedChips"></div>
              <div>
                <h3>Category<span>*</span></h3>
                <div class="custom-select-container">
                  <select id="categorySelect">
                    <option disabled selected>Select a category</option>
                    <option>Technical Task</option>
                    <option>User Story</option>
                  </select>
                  <img
                    src="../images/arrow_drop_down.svg"
                    alt=""
                    class="select-icon"
                  />
                </div>
                <span class="error-message" id="category-error"></span>
              </div>
              <!-- Subtask Section -->
              <div>
                <h3>Subtasks</h3>
                <div class="subtask-input">
                  <input
                    type="text"
                    id="subtask-input"
                    placeholder="Add new subtask"
                    onclick="activateSubtaskInput()"
                    autocomplete="off"
                  />
                  <div class="subTask-icons">
                    <img
                      onclick="confirmSubtaskEntry()"
                      id="check-subtask-icon"
                      src="../images/checkDark.svg"
                      alt="Confirm"
                      class="subtask-icon-check d-none select-icon"
                    />
                    <img
                      id="close-subtask-icon"
                      src="../images/close.svg"
                      alt="Cancel"
                      class="subtask-icon d-none select-icon"
                    />
                  </div>
                  <div class="seperator d-none" id="seperator"></div>

                  <img
                    id="add-icon"
                    src="../images/addDark.svg"
                    alt="subtask-icon"
                    class="select-icon"
                  />
                </div>
                <div id="subtask-list"></div>
              </div>
            </div>
          </section>
        </div>

        <div class="create-task-footer">
          <p><span>*</span>This field is required</p>
          <div class="form-actions">
            <div class="clear-btn-container">
              <button type="button" class="clear-button" onclick="clearForm()">
                Clear
                <img src="../images/canceldarkblue.svg" alt="Cancel icon" />
              </button>
            </div>
            <div class="create-btn-container">
              <button
                id="create-task-btn"
                onclick="createTask()"
                type="button"
                class="create-button"
              >
                Create Task
                <img src="../images/check.svg" alt="create icon" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
