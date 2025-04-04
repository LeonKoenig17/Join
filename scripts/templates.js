
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
        <input
          type="checkbox"
          class="assign-checkbox"
          data-user-id="${user.id}"
          data-user-name="${user.name}"
          data-user-email="${user.email}"
          data-user-index="${index}"
        />
        <p class="assigned-user-avatar">${getInitials(user.name || user.email)}</p>
        <p class="assigned-user-name">${user.name || user.email}</p>
      </div>
    `;
  }