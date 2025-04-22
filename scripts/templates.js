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
  return /*html*/ `
        <div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
            <div class="task-card">
                <div class="task-header">
                    <div class="user-story-label task-category ">User Story</div>
                    <button class="close-btn" onclick="closeOverlay()"><img src="../images/close.svg" alt=""></button>
                </div>
                <div class="task-content">
                    <h2 class="task-title">${task.title || ""}</h2>
                    <p class="task-description">${task.description || ""}</p>
                    <div class="task-details">
                        <div class="detail-row">
                            <span class="detail-label">Due date:</span>
                            <span class="detail-value">${
                              task.dueDate || ""
                            }</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">Priority:</span>
                            <span class="priority-badge ${
                              task.priority ? task.priority.toLowerCase() : ""
                            }">${task.priority || "Medium"}</span>
                        </div>
                        <div class="detail-row assigned-to">
                            <span class="detail-label">Assigned To:</span>
                            <div class="assignee-list">
                                ${generateAssigneeCircles(
                                  task.assignedTo || []
                                )}
                            </div>
                        </div>
                        <div class="subtasks-section">
                            <span class="detail-label">Subtasks</span>
                            <div class="subtask-list">
                                <div class="subtask-item">
                                    <input type="checkbox" id="subtask1" ${
                                      task.subtasks &&
                                      task.subtasks[0] === "ticked"
                                        ? "checked"
                                        : ""
                                    }>
                                    <label for="subtask1">Implement Recipe Recommendation</label>
                                </div>
                                <div class="subtask-item">
                                    <input type="checkbox" id="subtask2" ${
                                      task.subtasks &&
                                      task.subtasks[1] === "ticked"
                                        ? "checked"
                                        : ""
                                    }>
                                    <label for="subtask2">Start Page Layout</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="task-actions">
                    <button class="action-btn delete-btn" onclick="deleteTask(${
                      task.id
                    })">
                        <img src="../images/subtaskBin.svg" alt="delete-btn">
                        <span>Delete</span>
                    </button>
                    <div class="action-separator"></div>
                    <button class="action-btn edit-btn" onclick="editTask(${
                      task.id
                    })">
                        <img src="../images/edit-2.svg" alt="edit-btn">
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
      const userId = person.id || person.userId; // Unterstützung für beide Formate
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

function generateSubtasksHTML(subtasks) {
  return subtasks
    .map(
      (subtask) => /*html*/ `
        <div class="subtask-item">
            <input type="checkbox" ${subtask.completed ? "checked" : ""} 
                   onchange="updateSubtask('${subtask.id}', this.checked)">
            <span>${subtask.text}</span>
        </div>
    `
    )
    .join("");
}

function subtasksTemplate(subtask, index) {
  return /*html*/ `  
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

function assignedUserTemplate(user, index) {
  return /*html*/ `
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
