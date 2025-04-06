const subtaskTemplate = (task, index) => {
  return (
    '<li data-index="' +
    index +
    '">' +
    task +
    ' <button class="delete-subtask" data-index="' +
    index +
    '">Delete</button></li>'
  );
};

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
        <p class="assigned-user-avatar">${getInitials(
          user.name || user.email
        )}</p>
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
