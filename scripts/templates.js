
  const subtaskTemplate = (task, index) => {
    return '<li data-index="' + index + '">' + task +
           ' <button class="delete-subtask" data-index="' + index + '">Delete</button></li>';
  };


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
    return '<option value="' + id + '">' + (user.name || user.email) + '</option>';
  }
  

/**
 * Generates an HTML template string for an assigned user item.
 *
 * @param {Object} user - The user object containing user details.
 * @param {number} user.id - The unique identifier of the user.
 * @param {string} user.name - The name of the user.
 * @param {string} user.email - The email of the user.
 * @param {number} index - The index of the user in the list.
 * @returns {string} The HTML template string for the assigned user item.
 */
function assignedUserTemplate(user, index) {
    return `
      <div class="assigned-user-item">
       
        <p class="assigned-user-avatar">${getInitials(user.name || user.email)}</p>
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
    `;
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
  </div>
  `;
}

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