function assignedUserTemplate(user, index, isChecked = false) {
  return `
    <div class="assigned-user-item">
        <div class="assigned-user-avatar-container" style="background-color: ${user.color};">
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
                data-user-color="${user.color}"
                data-user-index="${index}"
                ${isChecked ? "checked" : ""}
            />
        </div>
    </div>
  `;
}


function generateCardAssigneeHTML(assignees) {
  if (!Array.isArray(assignees)) return "";
  return assignees
    .map((person) => {
      if (!person || (!person.id && !person.userId)) return "";
      const userId = person.id || person.userId;
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


function taskOverlayAssignee(assignees) {
  if (!Array.isArray(assignees)) return "";
  return assignees
    .map((user) => {
      if (!user) return "";
      const initials = getInitials(user.name || user.email);
      const displayName = user.name || user.email;
      const color = user.color || "#A8A8A8";

      return `
      <div class="assignee-item">
        <div class="assignee-circle" style="background-color: ${color};">
          ${initials}
        </div>
        <span class="assigned-user-name">${displayName}</span>
      </div>
    `;
    })
    .join("");
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