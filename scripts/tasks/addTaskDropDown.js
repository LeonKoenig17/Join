// addTaskDropDown.js

/**
 * Initializes the assign dropdown for tasks by loading users and contacts from Firebase,
 * rendering the dropdown options, and setting up event listeners.
 */
async function initAssignedDropdown() {
  try {
    const users = await loadFirebaseUsers();
     const contacts = await loadFirebaseContacts();
     const options  = [...users, ...contacts];
    renderDropdownOptions(options);
    setupDropdownEventListeners(options);
  } catch (err) {
    console.error("Fehler beim Initialisieren des Dropdowns:", err);
  }
}

/**
 * Renders the options in the dropdown.
 * @param {Array<Object>} users - The list of users.
 * @param {Array<Object>} [assignedTo=[]] - The already assigned users.
 */
function renderDropdownOptions(users, assignedTo = []) {
  const opts = document.getElementById("assignedDropdownOptions");
  if (!opts) return;

  opts.innerHTML = users
    .map((user, index) => {
      const isChecked = assignedTo.some(a => String(a.id) === String(user.id));
      return assignedUserTemplate(user, index, isChecked);
    })
    .join("");
}

/**
 * Sets up event listeners for the dropdown.
 * @param {Array<Object>} users - The list of users.
 */
function setupDropdownEventListeners(users) {
  const sel = document.getElementById("assignedDropdownSelected");
  const opts = document.getElementById("assignedDropdownOptions");
  const dd = document.getElementById("assignedDropdown");

  if (!sel || !opts || !dd) {
    return;
  }

  addDropdownToggleListener(sel, opts);
  addDocumentClickListener(dd, opts);
  addOptionsChangeListener(opts, users);
}

/**
 * Adds a click listener to toggle the dropdown.
 * @param {HTMLElement} sel - The selected dropdown element.
 * @param {HTMLElement} opts - The dropdown options.
 */
function addDropdownToggleListener(sel, opts) {
  sel.addEventListener("click", function (e) {
    e.stopPropagation();
    opts.classList.toggle("show");
  });
}

/**
 * Adds a click listener to the document to close the dropdown when clicking outside.
 * @param {HTMLElement} dd - The dropdown element.
 * @param {HTMLElement} opts - The dropdown options.
 */
function addDocumentClickListener(dd, opts) {
  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) {
      opts.classList.remove("show");
    }
  });
}

/**
 * Adds a change listener to the dropdown options.
 * @param {HTMLElement} opts - The dropdown options.
 * @param {Array<Object>} users - The list of users.
 */
function addOptionsChangeListener(opts, users) {
  opts.addEventListener("change", function () {
    updateAssignedChips(users);
  });
}

/**
 * Updates the assigned chips based on the selected users.
 * @param {Array<Object>} users - The list of users.
 */
function updateAssignedChips(users) {
  const chipsContainer = document.getElementById("assignedChips");
  if (!chipsContainer) return;

  const checkboxes = document.querySelectorAll(".assign-checkbox");
  const chips = Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => createChipHTML(users, cb.dataset.userId));

  chipsContainer.innerHTML = chips.join("");
}

/**
 * Creates the HTML for a chip based on the user ID.
 * @param {Array<Object>} users - The list of users.
 * @param {string} userId - The ID of the user.
 * @returns {string} The HTML of the chip.
 */
function createChipHTML(users, userId) {
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) return "";
  const initials = getInitials(user.name || user.email);
  return `<div class="assigned-chip" style="background-color: ${user.color};">${initials}</div>`;
}

/**
 * Returns the initials of a name or email.
 * @param {string} [fullName=""] - The full name or email address.
 * @returns {string} The initials.
 */
function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join("");
}

/**
 * Loads the users from Firebase.
 * @returns {Promise<Array<Object>>} A list of users.
 */
async function loadFirebaseUsers() {
  const res      = await fetch(BASE_URL + "/login.json");
  const usersObj = await res.json();
  const users    = [];

  if (usersObj) {
    for (const key in usersObj) {
      const entry = usersObj[key];
      const { password, ...rest } = entry;
      users.push({
        id:    key,
        ...rest,
      });
    }
  }

  return users;
}

/**
 * Loads the contacts from Firebase.
 * @returns {Promise<Array<Object>>} A list of contacts.
 */
async function loadFirebaseContacts() {
  const res         = await fetch(BASE_URL + "/contact.json");
  const contactsObj = await res.json();
  const contacts    = [];

  if (contactsObj) {
    for (const key in contactsObj) {
      const entry = contactsObj[key];
      contacts.push({
        id:    key,
        ...entry
      });
    }
  }

  return contacts;
}