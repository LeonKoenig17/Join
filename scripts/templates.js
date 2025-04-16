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

function boardOverlayTemplate(task) {
  return `
  <div class="overlay-content">
    <div id="overlayHeader">
      <h1>Edit Task</h1>
      <button id="closeOverlayBtn" onclick="closeOverlay()">x</button>
    </div>
    <div id="overlayMain">
      <div id="message"></div>
      <section id="addTask">
        <div class="half-width addTask-left">
          <form class="forms" id="editTaskForm">
            <label for="editTitle">Title<span>*</span></label>
            <input type="text" id="editTitle" name="editTitle" placeholder="Enter a title" value="${task.title}" required>
            <span class="error-message" id="edit-title-error"></span>
            
            <label for="editDescription">Description</label>
            <textarea id="editDescription" name="editDescription" placeholder="Enter a Description">${task.description}</textarea>
            <span class="error-message" id="edit-description-error"></span>
            
            <label for="editDueDate">Due date<span>*</span></label>
            <div class="custom-date-input">
              <input type="date" id="editDueDate" name="editDueDate" value="${task.dueDate}" required>
              <img src="../images/calendar.svg" alt="Calendar Icon">
            </div>
            <span class="error-message" id="edit-due-date-error"></span>
          </form>
        </div>
        <div class="separator"></div>
        <div class="half-width addTask-right">
          <h3 class="h3-priority">Priority</h3>
          <div class="priority-buttons">
            <button type="button" class="priority priority-urgent ${task.priority === 'Urgent' ? 'active-btn' : ''}">
              Urgent
              <img src="../images/urgent.svg" alt="Urgent">
            </button>
            <button type="button" class="priority priority-medium ${task.priority === 'Medium' ? 'active-btn' : ''}">
              Medium
              <img src="../images/medium.svg" alt="Medium">
            </button>
            <button type="button" class="priority priority-low ${task.priority === 'Low' ? 'active-btn' : ''}">
              Low
              <img src="../images/low.svg" alt="Low">
            </button>
          </div>
          
          <div>
            <h3>Assigned to</h3>
            <div class="custom-select-container" id="editAssignedDropdown">
              <select id="editAssignedSelect">
                <option>Select contacts to assign</option>
                <!-- Dynamisch zu befüllende Optionen -->
              </select>
              <img src="../images/arrow_drop_down.svg" alt="Dropdown Icon" class="select-icon">
            </div>
            <span class="error-message" id="edit-assigned-error"></span>
          </div>
          
          <div>
            <h3>Category<span>*</span></h3>
            <div class="custom-select-container">
              <select id="editCategorySelect">
                <option disabled>Select task category</option>
                <option ${task.category === 'Technical Task' ? 'selected' : ''}>Technical Task</option>
                <option ${task.category === 'User Story' ? 'selected' : ''}>User Story</option>
              </select>
              <img src="../images/arrow_drop_down.svg" alt="Dropdown Icon" class="select-icon">
            </div>
            <span class="error-message" id="edit-category-error"></span>
          </div>
          
          <div>
            <h3>Subtasks</h3>
            <div class="subtask-input">
              <input type="text" id="editSubtaskInput" placeholder="Add new subtask" autocomplete="off">
              <div class="subTask-icons">
                <img onclick="confirmSubtaskEditEntry()" id="check-edit-subtask-icon" src="../images/checkDark.svg" alt="Confirm" class="subtask-icon-check d-none select-icon">
                <img id="close-edit-subtask-icon" src="../images/close.svg" alt="Cancel" class="subtask-icon d-none select-icon">
              </div>
              <div class="seperator d-none" id="editSeperator"></div>
              <img id="add-edit-icon" src="../images/addDark.svg" alt="Subtask Icon" class="select-icon">
            </div>
            <div id="editSubtaskList">
              <!-- Hier werden die bestehenden Subtasks (falls vorhanden) dynamisch eingebunden -->
            </div>
          </div>
        </div>
      </section>
    </div>
    <div class="create-task-footer">
      <p><span>*</span>This field is required</p>
      <div class="form-actions">
        <div class="clear-btn-container">
          <button type="button" class="clear-button" onclick="clearEditForm()">
            Clear
            <img src="../images/canceldarkblue.svg" alt="Cancel icon">
          </button>
        </div>
        <div class="create-btn-container">
          <button id="save-task-btn" type="button" class="create-button" onclick="updateTask(${task.taskIndex})">
            Save Changes
            <img src="../images/checkDark.svg" alt="Save icon">
          </button>
        </div>
      </div>
    </div>
  </div>
  `;
}

