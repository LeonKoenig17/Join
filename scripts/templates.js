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


function assignedUserTemplate(user, index, isChecked = false) {
  return `
    <div class="assigned-user-item">
        <div class="assigned-user-avatar-container" style="background-color: ${user.color};">
            <p class="assigned-user-avatar">${getInitials(user.name || user.email)}</p>
        </div>
        <div class="assigned-user-details">
            <p class="assigned-user-name">${user.name || user.email}</p>
            <input
                type="checkbox"
                class="assign-checkbox"
                data-user-id="${user.id}"
                data-user-name="${user.name}"
                data-user-email="${user.email}"
                data-user-color="${user.color}"
                data-user-index="${index}"
                ${isChecked ? "checked" : ""}
            />
        </div>
    </div>
  `;
}

/**
 * Normalisiert task.subtasks und berechnet Count + Progress.
 * @param {Object} task
 * @returns {{completedSubtasks: number, totalSubtasks: number, progressPercentage: number}}
 */
function checkSubtask(task) {
  const subs = Array.isArray(task.subtasks)
    ? task.subtasks
    : task.subtasks && typeof task.subtasks === "object"
    ? Object.values(task.subtasks)
    : [];

  const totalSubtasks = subs.length;
  const completedSubtasks = subs.filter((s) => s.completed === true).length;
  const progressPercentage =
    totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

  return { completedSubtasks, totalSubtasks, progressPercentage };
}

function generateTaskCard(task) {
  const { completedSubtasks, totalSubtasks, progressPercentage } =
    checkSubtask(task);

  return `
    <div id="task${task.taskIndex}" tabindex="0" class="task" draggable="true"
         onclick="showTaskOverlay(${JSON.stringify(task).replace(
           /"/g,
           "&quot;"
         )})">
      <div class="task-category ${
        task.category ? task.category.toLowerCase().replace(" ", "-") : ""
      }">
        ${task.category || ""}
      </div>
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
            ${generateCardAssigneeHTML(task.assignedTo)}
          </div>
          <div class="task-priority ${
            task.priority ? task.priority.toLowerCase() : ""
          }">
            <img src="../images/${
              task.priority ? task.priority.toLowerCase() : "low"
            }.svg"
                 alt="${task.priority || "Low priority"}">
          </div>
        </div>
      </div>
    </div>
  `;
}

function generateCardAssigneeHTML(assignees) {
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
  return `
        <div class="subtask-item" data-subtask-index="${index}">
            <p class="subtask-text">• ${subtask.name}</p>
            <div class="subtask-icons">
                <img src="../images/edit-2.svg" alt="Edit" class="subtask-icon edit-subtask" data-index="${index}">
                <div class="vertical-line-subtask-dark"></div>
                <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-subtask" data-index="${index}">
            </div>
        </div>
    `;
}

function generateTaskOverlay(task) {
  const subtasksOverlayHTML = (task.subtasks || [])
    .map((subtask, idx) => taskOverlaySubtaskTemplate(subtask, idx))
    .join("");

  const assigneesHTML = taskOverlayAssignee(task.assignedTo || []);

  return /*html*/ `
    <div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
      <div class="task-card-overlay">
        <div class="task-header">
         <div class="task-category ${
        task.category ? task.category.toLowerCase().replace(" ", "-") : ""
      }">
        ${task.category || ""}
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
              <span class="detail-value">${task.dueDate ? task.dueDate.replace(/-/g, '/') : ''}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Priority:</span>
              <div class="task-priority ${
                task.priority ? task.priority.toLowerCase() : ""
              }"> ${task.priority} &nbsp;
            <img src="../images/${
              task.priority ? task.priority.toLowerCase() : "low"
            }.svg"
                 alt="${task.priority || "Low priority"}">
          </div>
            </div>
            <div class="detail-row assigned-to">
              <span class="detail-label">Assigned To:</span>
              <div class="assignee-list">
                ${assigneesHTML}
              </div>
            </div>
          </div>
          <div class="subtasks-section">
            <span class="detail-label">Subtasks</span>
            <div id="subtask-list" class="subtask-list">
              ${subtasksOverlayHTML}
            </div>
          </div>
        </div>
        <div class="task-actions">
          <button class="action-btn delete-btn" onclick="confirmDeleteTask(event, '${task.id}')">
            <img src="../images/subtaskBin.svg" alt="Delete">
            <span>Delete</span>
          </button>
          <div class="action-separator"></div>
          <button class="action-btn edit-btn" onclick="closeOverlay(); setTimeout(() => showEditTaskOverlay('${task.id}'), 150)">
            <img src="../images/edit-2.svg" alt="Edit">
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

function taskOverlayAssignee(assignees) {
  if (!Array.isArray(assignees)) return "";
  return assignees
    .map((user) => {
      if (!user) return "";
      const initials = getInitials(user.name || user.email);
      const displayName = user.name || user.email;
      const color = user.color || "#A8A8A8";

      return `
      <div class="assignee-item">
        <div class="assignee-circle" style="background-color: ${color};">
          ${initials}
        </div>
        <span class="assigned-user-name">${displayName}</span>
      </div>
    `;
    })
    .join("");
}

/**
 * Renders subtasks in the overlay with custom checkbox icons
 */
function taskOverlaySubtaskTemplate(subtask, index) {
  const iconSrc = subtask.completed
    ? '../images/checkboxtrueblack.svg'
    : '../images/checkboxfalseblack.svg';
  const altText = subtask.completed ? 'Completed' : 'Incomplete';

  return `
    <div class="subtask-checkbox-container">
      <img
        src="${iconSrc}"
        alt="${altText}"
        class="subtask-checkbox-icon"
        onclick="toggleSubtaskCompletion(${index})"
      />
      <label for="subtask-${index}" class="subtask-label">${subtask.name}</label>
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
  const subtasksHTML = subtasks
    .map((subtask, index) => subtasksTemplate(subtask, index))
    .join("");
  return `
    <div class="task-overlay add-task-page" id="taskOverlay" onclick="handleOverlayClick(event)">
      <div class="add-task-card ">
        <div class="task-header">
          <h1>Add Task</h1>
          <button class="close-btn" onclick="closeOverlay()"><img src="../images/close.svg" alt="close"></button>
        </div>
        <div class="task-content">
          <section id="addTask">
            <div class="half-width addTask-left">
              <form class="forms" id="taskForm">
                <label for="title">Title<span> *</span></label>
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
                <label for="due-date">Due date<span> *</span></label>
                <div class="custom-date-input">
                  <input type="date" id="due-date" name="due-date" required />
                  <img src="../images/calendar.svg" alt="Calendar Icon" />
                </div>
                <span class="error-message" id="due-date-error"></span>
              </form>
            </div>
            <div class="separator"></div>
            <div class="half-width addTask-right">
              <label class="right-label">Priority</label>
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
                <label class="right-label">Assigned to</label>
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
                <label class="right-label">Category<span> *</span></label>
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
                <label class="right-label">Subtasks</label>
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
                <div id="subtask-list" class="subtask-list">
                ${subtasksHTML}
                </div>
              </div>
            </div>
          </section>
        </div>

        <div class="create-task-footer">
          <p><span>*</span>This field is required</p>
          <div class="form-actions">
            <div class="close-btn-container">
              
                  <button class="close-btn-footer" onclick="closeOverlay()"><span>Cancel<span></button>
             
            </div>
            <div class="create-btn-container">
              <button
                id="create-task-btn"
                onclick="createTask()"
                type="button"
                class="create-task-btn"
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

/**
 * Neues Overlay-Template für den Edit-Modus
 * @param {Object} task - Task-Daten aus Firebase
 * @param {Array} users - Liste aller User für Dropdown/Chips
 */
function editTaskOverlayTemplate(task, users) {
  // Subtasks als Listeneinträge
  const subsHTML = (Array.isArray(task.subtasks) ? task.subtasks : Object.values(task.subtasks) || [])
    .map((s, i) => subtasksTemplate(s, i))
    .join("\n");

  // Priority-Buttons aktiv setzen
  const p = (level) => task.priority.toLowerCase() === level.toLowerCase() ? 'active-btn' : '';

  // Assignee-Chips
  const chipsHTML = (task.assignedTo || []).map(u =>
    `<div class="assigned-chip" style="background:${u.color};">${getInitials(u.name)}</div>`
  ).join("\n");

  return `
<div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
  <div class="add-task-card edit-mode">
    <div class="task-header">
      <div class="user-story-label task-category">Edit Task</div>
      <button class="close-btn" onclick="closeOverlay()">
        <img src="../images/close.svg" alt="close">
      </button>
    </div>
    <div class="task-content">
      <h1>Edit Task</h1>
      <section class="edit-task" class="vertical-layout">
        <div class="half-width addTask-left-edit">
          <form class="forms" id="taskForm">
            <label for="title">Title<span>*</span></label>
            <input type="text" id="title" name="title" required value="${task.title}" />
              <span id="title-error" class="error-msg"></span>
            <label for="description">Description</label>
            <textarea id="description" name="description" max-height: 150px;" spellcheck="false">${task.description} </textarea>
             <span id="description-error" class="error-msg"></span>
            <label for="due-date">Due date<span>*</span></label>
            <div class="custom-date-input">
              <input type="date" id="due-date" name="due-date" required value="${task.dueDate}" />
              <img src="../images/calendar.svg" alt="Calendar Icon" />
              <span id="due-date-error" class="error-msg"></span>
            </div>
          </form>
        </div>
        <div class="separator"></div>
        <div class="half-width addTask-right-edit">
          <h3>Priority</h3>
          <div class="priority-buttons">
            <button type="button" class="priority priority-urgent ${p('Urgent')}" onclick="setPriority(this)">Urgent <img src="../images/urgent.svg" /></button>
            <button type="button" class="priority priority-medium ${p('Medium')}" onclick="setPriority(this)">Medium <img src="../images/medium.svg" /></button>
            <button type="button" class="priority priority-low ${p('Low')}" onclick="setPriority(this)">Low <img src="../images/low.svg" /></button>
          </div>

          <h3>Assigned to</h3>
          <div class="custom-assigned-dropdown" id="assignedDropdown">
            <div class="dropdown-selected" id="assignedDropdownSelected">
              Select contacts to assign
              <img src="../images/arrow_drop_down.svg" alt="Dropdown Icon" class="select-icon" />
            </div>
            <div class="dropdown-options" id="assignedDropdownOptions">
              ${users
                .map(
                  (user) => `
                    <div class="dropdown-option">
                      <input
                        type="checkbox"
                        class="assign-checkbox"
                        data-user-id="${user.id}"
                        data-user-name="${user.name}"
                        data-user-email="${user.email}"
                        ${task.assignedTo && task.assignedTo.some((assigned) => assigned.id === user.id) ? 'checked' : ''}
                      />
                      <span>${user.name || user.email}</span>
                    </div>
                  `
                )
                .join('')}
            </div>
          </div>
          <div class="assigned-chips" id="assignedChips">
            ${chipsHTML}
          </div>

          <h3>Category<span>*</span></h3>
          <div class="custom-select-container">
            <select id="categorySelect">
              <option disabled>Select a category</option>
              <option ${task.category === 'User Story' ? 'selected' : ''}>User Story</option>
              <option ${task.category === 'Technical Task' ? 'selected' : ''}>Technical Task</option>
            </select>
            <img src="../images/arrow_drop_down.svg" alt="" class="select-icon"/>
            <span id="category-error" class="error-msg"></span>
          </div>

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
          <div id="subtask-list" class="subtask-list">
            ${subsHTML}
          </div>
        </div>
      </section>
    </div>
    <div class="create-task-footer">
      <div class="form-actions-edit">
        <button class="close-btn-footer" onclick="closeOverlay()">Cancel</button>
        <button id="save-task-btn" type="button" class="create-task-btn" onclick="saveTask('${task.id}')">Ok <img src="../images/check.svg" /></button>
      </div>
    </div>
  </div>
</div>
`;
}