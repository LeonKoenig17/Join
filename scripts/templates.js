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
<<<<<<< HEAD
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
=======
  }

function addTaskOverlayTemplate() {
  return `
    <div>
      <div id="overlayHeader">
          <h2>Add Task</h2>
          <button id="close" onclick="closeOverlay()">x</button>
      </div>
      <div id="overlayMain">
          <div id="left">
              <label for="title">Title<span class="requiredMark">*</span></label>
              <input type="text" id="title" placeholder="Enter a title">
              <label for="description">Description</label>
              <textarea name="" id="description" placeholder="Enter a description"></textarea>
              <label for="dueDate">Due date<span class="requiredMark">*</span></label>
              <div id="dueDateContainer" class="dropDown inputHover">
                  <input type="text" id="dueDate" placeholder="dd/mm/yyyy">
                  <button id="calenderBtn" class="smallButton btnInInput"><img src="../images/calendar.svg" alt=""></button>
              </div>
          </div>
          <div class="line"></div>
          <div id="right">
              <label for="priority">Priority</label>
              <div id="priorityBtns">
                  <button id="urgentBtn" onclick="selectPrio(this.id)">Urgent<i class="urgentBtn"></i></button>
                  <button id="mediumBtn" onclick="selectPrio(this.id)">Medium<i class="mediumBtn"></i></button>
                  <button id="lowBtn" onclick="selectPrio(this.id)">Low<i class="lowBtn"></i></button>
              </div>
              <label for="assignedTo">Assigned To</label>
              <div id="assignedTo">
                  <div class="dropDown" onclick="toggleDropMenu('assignedTo')">
                      <span>Select contacts to assign</span>
                      <i></i>
                  </div>
                  <div class="dropSelection">
                      <p>user1</p>
                      <p>user2</p>
                  </div>
              </div>
              <label for="category">Category<span class="requiredMark">*</span></label>
              <div id="category">
                  <div class="dropDown" onclick="toggleDropMenu('category')">
                      <span>Select task category</span>
                      <i></i>
                  </div>
                  <div class="dropSelection">
                      <p onclick="selectCategory(this)">Technical Task</p>
                      <p onclick="selectCategory(this)">User Story</p>
                  </div>
              </div>
              <label for="subtasks">Subtasks</label>
              <div id="subtasks" class="dropDown inputHover">
                  <input type="text" placeholder="Add new subtask">
                  <div class="btnInInput">
                      <button id="subtaskPlus" class="smallButton" onclick="focusInputField()"><img src="../images/subtaskPlus.svg" alt=""></button>
                      <button id="subtaskCross" class="smallButton" onclick="clearSubtaskInput()"><img src="../images/subtaskX.svg" alt=""></button>
                      <button id="subtaskCheck" class="smallButton" onclick="addSubtask(); subtaskHover()"><img src="../images/subtaskCheck.svg" alt=""></button>
                  </div>
              </div>
              <div id="addedSubContainer"></div>
          </div>
      </div>
      <div id="overlayFooter">
          <span><span class="requiredMark">*</span>This field is required</span>
          <div id="closeBtns">
              <button id="cancel" onclick="closeOverlay()">Cancel</button>
              <button id="addTaskOverlayBtn" onclick="addTask()">Add Task</button>
          </div>
      </div>
>>>>>>> 099320b008a0504a3fbe07466b92743df2a5e92a
  </div>
  `;
}

<<<<<<< HEAD
=======
function addedSubContainerTemplate(value) {
  return `
        <div class="addedSub">
            <span>\u2022 ${value}</span>
            <input type="text" class="subEditor">
            <div class="btnInInput">
                <button id="addedSubEdit" class="smallButton" onclick="enableEditMode(this.parentElement.parentElement)"><img src="../images/subtaskEdit.svg" alt=""></button>
                <button id="addedSubDelete" class="smallButton" onclick="deleteElement(this.parentElement.parentElement)"><img src="../images/subtaskBin.svg" alt=""></button>
                <button id="addedSubConfirm" class="smallButton" onclick="disableEditMode(this.parentElement.parentElement)"><img src="../images/subtaskCheck.svg" alt=""></button>
            </div>
        </div>
    `;
}
>>>>>>> 099320b008a0504a3fbe07466b92743df2a5e92a
