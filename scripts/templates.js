function subtasksTemplate(subtask, index) {
  return `  
    <div class="subtask-item">
      <p class="subtask-text">• ${subtask.name}</p>
      <div class="subtask-icons">
        <img src="../images/edit-2.svg" alt="Edit" class="subtask-icon edit-icon" onclick="editSubtask(${index})">
        <div class="vertical-line-subtask-dark"></div>
        <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
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

function assignedUserTemplate(user, index) {
  return `
      <div class="assigned-user-item">
        <div class="assigned-user-avatar-container"
             style="background-color: ${user.color};">
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

function editOverlayTemplate(task) {
  return `
    <div class="overlay">
      <div class="task-overlay-header">
        <span class="task-overlay-category" style="background-color: ${
          task.categoryColor
        };">${task.category}</span>
        <img src="../images/close.svg" alt="Close" class="task-overlay-close" onclick="closeOverlay()">
      </div>
      <h2 class="task-overlay-title">${task.title}</h2>
      <p class="task-overlay-description">${task.description}</p>
      <div class="task-overlay-details">
        <div class="task-overlay-detail">
          <span class="task-overlay-detail-label">Due date:</span>
          <span class="task-overlay-detail-value">${task.dueDate}</span>
        </div>
        <div class="task-overlay-detail">
          <span class="task-overlay-detail-label-priority">Priority:</span>
          <span class="task-overlay-detail-value-priority task-overlay-priority-${
            task.priority ? task.priority.toLowerCase() : "default"
          }">
            ${task.priority || "No priority"}
            <img src="../images/${
              task.priority ? task.priority.toLowerCase() : "default"
            }.svg" alt="${task.priority || "No priority"}">
          </span>
        </div>
        <div class="assignedto-detail">
          <span class="task-overlay-detail-label">Assigned To:</span>
          <div class="task-overlay-assigned-users">
            ${(Array.isArray(task.assignedTo) ? task.assignedTo : [])
              .map(
                (user) => `
        <div class="assigned-user-avatar-edit-container"
             style="background-color: ${user.color};">
          <p class="assigned-user-avatar user-color">${getInitials(
            user.name || user.email
          )}</p>
          <p>${user.name || user.email}</p>
        </div>
              </div>
            `
              )
              .join("")}
          </div>
      <div class="task-overlay-subtasks">
        <h3>Subtasks</h3>
        ${(Array.isArray(task.subtasks) ? task.subtasks : [])
          .map(
            (subtask) => `
          <div class="subtask">
            <img src="../images/${
              subtask.completed ? "subtaskBoxTicked" : "subtaskBoxUnticked"
            }.svg" alt="${subtask.completed ? "Completed" : "Incomplete"}">
            <span>${subtask.name}</span>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="task-overlay-actions">
        <button class="task-overlay-delete" onclick="deleteTask(${task.id})">
          <img src="../images/subtaskBin.svg" alt="Delete"> Delete
        </button>
        <div id="seperator"></div>
        <button class="task-overlay-edit" onclick="editTask(${task.id})">
          <img src="../images/edit-2.svg" alt="Edit"> Edit
        </button>
      </div>
    </div>
    </div>
      </div>
  `;
}
