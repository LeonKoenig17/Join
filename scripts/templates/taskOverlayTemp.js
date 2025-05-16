function generateTaskOverlay(task) {
  const subs = Array.isArray(task.subtasks)
    ? task.subtasks
    : typeof task.subtasks === "object"
    ? Object.values(task.subtasks)
    : [];

  const subtasksOverlayHTML = subs
    .map((subtask, idx) => taskOverlaySubtaskTemplate(subtask, idx))
    .join("");

  const assigneesHTML = taskOverlayAssignee(task.assignedTo || []);

  return `
    <div class="task-overlay" id="taskOverlay" onclick="handleOverlayClick(event)">
      <div class="task-card-overlay">
        <div class="task-header">
          <div class="task-category ${
            task.category ? task.category.toLowerCase().replace(" ", "-") : ""
          }">${task.category || ""}</div>
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
              <span class="detail-value">${
                task.dueDate ? task.dueDate.replace(/-/g, "/") : ""
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Priority:</span>
              <div class="task-priority ${
                task.priority ? task.priority.toLowerCase() : ""
              }">
                ${task.priority || "Low"} &nbsp;
                <img src="../images/${
                  task.priority ? task.priority.toLowerCase() : "low"
                }.svg"
                     alt="${task.priority || "Low"}">
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
          <button class="action-btn delete-btn" onclick="confirmDeleteTask(event, '${
            task.id
          }')">
            <img src="../images/subtaskBin.svg" alt="Delete">
            <span>Delete</span>
          </button>
          <div class="action-separator"></div>
          <button class="action-btn edit-btn" onclick="closeOverlay(); setTimeout(() => showEditTaskOverlay('${
            task.id
          }'), 150)">
            <img src="../images/edit-2.svg" alt="Edit">
            <span>Edit</span>
          </button>
        </div>
      </div>
    </div>
  `;
}
