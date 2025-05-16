/**
 * Neues Overlay-Template für den Edit-Modus
 * @param {Object} task - Task-Daten aus Firebase
 * @param {Array} users - Liste aller User für Dropdown/Chips
 */
function editTaskOverlayTemplate(task, users) {
  // Subtasks als Listeneinträge
  const subsHTML = (
    Array.isArray(task.subtasks)
      ? task.subtasks
      : Object.values(task.subtasks) || []
  )
    .map((s, i) => subtasksTemplate(s, i))
    .join("\n");

  // Priority-Buttons aktiv setzen
  const p = (level) =>
    task.priority.toLowerCase() === level.toLowerCase() ? "active-btn" : "";

  // Assignee-Chips
  const chipsHTML = (task.assignedTo || [])
    .map(
      (u) =>
        `<div class="assigned-chip" style="background:${
          u.color
        };">${getInitials(u.name)}</div>`
    )
    .join("\n");

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
            <input type="text" id="title" name="title" required value="${
              task.title
            }" />
              <span id="title-error" class="error-msg"></span>
            <label for="description">Description</label>
            <textarea id="description" name="description" style="max-height: 200px; max-width: 500px;" spellcheck="false">${
              task.description
            }</textarea>
             <span id="description-error" class="error-msg"></span>
            <label for="due-date">Due date<span>*</span></label>
            <div class="custom-date-input">
              <input type="date" id="due-date" name="due-date" required value="${
                task.dueDate
              }" />
              <img src="../images/calendar.svg" alt="Calendar Icon" />
              <span id="due-date-error" class="error-msg"></span>
            </div>
          </form>
        </div>
        <div class="separator"></div>
        <div class="half-width addTask-right-edit">
          <h3>Priority</h3>
          <div class="priority-buttons">
            <button type="button" class="priority priority-urgent ${p(
              "Urgent"
            )}" onclick="setPriority(this)">Urgent <img src="../images/urgent.svg" /></button>
            <button type="button" class="priority priority-medium ${p(
              "Medium"
            )}" onclick="setPriority(this)">Medium <img src="../images/medium.svg" /></button>
            <button type="button" class="priority priority-low ${p(
              "Low"
            )}" onclick="setPriority(this)">Low <img src="../images/low.svg" /></button>
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
                  <div
                    class="dropdown-options"
                    id="assignedDropdownOptions"
                  ></div>
                </div>
              </div>
              <div class="assigned-chips" id="assignedChips"></div>

          <h3>Category<span>*</span></h3>
          <div class="custom-select-container">
            <select id="categorySelect">
              <option disabled>Select a category</option>
              <option ${
                task.category === "User Story" ? "selected" : ""
              }>User Story</option>
              <option ${
                task.category === "Technical Task" ? "selected" : ""
              }>Technical Task</option>
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
       <button id="save-task-btn" type="button" class="create-task-btn">Ok <img src="../images/check.svg" /></button>
      </div>
    </div>
  </div>
</div>
`;
}
