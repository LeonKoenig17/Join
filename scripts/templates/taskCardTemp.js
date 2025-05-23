function generateTaskCard(task) {
  const { completedSubtasks: done, totalSubtasks: total, progressPercentage } = checkSubProgress(task);

  const maxLen = 40;
  const desc = task.description || "";
  const shortDesc = desc.length > maxLen 
    ? desc.slice(0, maxLen) + "…" 
    : desc;

  const stateCls = (total > 0 && done === total) ? 'all-done' : 'not-done';
  return `
    <div id="task${task.id}" tabindex="0" class="task" draggable="true"
         onclick="showTaskOverlayById('${task.id}')">
      <div class="task-category ${
        task.category ? task.category.toLowerCase().replace(" ", "-") : ""
      }">
        ${task.category || ""}
      </div>
      <h3 class="task-title">${task.title || ""}</h3>
      <p class="task-description">${shortDesc}</p>
      
      <div class="task-footer">
        <div class="task-subtasks">
          <div class="subtask-progress-container">
            <div class="subtask-progress-bar" style="width: ${progressPercentage}%"></div>
          </div>
            <span class="subtask-count ${stateCls}">
            ${done}/${total} Subtasks
          </span>
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

function columnBtnTemplate(label, key) {
  return `
    <div class="column-header">
      <span>${label}</span>
      <button id="${key}Btn"
              class="add-task"
              onclick="showAddTaskOverlay('${key}')">
      </button>
    </div>
  `;
}

function mobileActionsTemplate() {
  return `
    <div id="mobileTaskActions">
      <h4>Move To</h4>
      <ul>
        <li onclick="processMobileInput('toDo')">To Do</li>
        <li onclick="processMobileInput('inProgress')">In Progess</li>
        <li onclick="processMobileInput('awaitFeedback')">Await Feedback</li>
        <li onclick="processMobileInput('done')">Done</li>
      </ul>
    </div>
  `;
}