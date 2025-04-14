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
    return '<option value="' + id + '">' + (user.name || user.email) + '</option>';
  }
  

  function assignedUserTemplate(user, index) {
    return `
      <div class="assigned-user-item">
  
        <div class="assigned-user-avatar-container"
             style="background-color: ${user.color};">
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
            data-user-index="${index}"
          />
        </div>
      </div>
    `;
  }
  