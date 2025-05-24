// addTaskDropDown.js

/**
 * Initialisiert das Assign-Dropdown für Aufgaben.
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
 * Rendert die Optionen im Dropdown.
 * @param {Array<Object>} users - Die Liste der Benutzer.
 * @param {Array<Object>} [assignedTo=[]] - Die bereits zugewiesenen Benutzer.
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
 * Setzt die Event-Listener für das Dropdown.
 * @param {Array<Object>} users - Die Liste der Benutzer.
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
 * Fügt einen Klick-Listener hinzu, um das Dropdown umzuschalten.
 * @param {HTMLElement} sel - Das ausgewählte Dropdown-Element.
 * @param {HTMLElement} opts - Die Dropdown-Optionen.
 */
function addDropdownToggleListener(sel, opts) {
  sel.addEventListener("click", function (e) {
    e.stopPropagation();
    opts.classList.toggle("show");
  });
}

/**
 * Fügt einen Klick-Listener zum Dokument hinzu, um das Dropdown zu schließen.
 * @param {HTMLElement} dd - Das Dropdown-Element.
 * @param {HTMLElement} opts - Die Dropdown-Optionen.
 */
function addDocumentClickListener(dd, opts) {
  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) {
      opts.classList.remove("show");
    }
  });
}

/**
 * Fügt einen Change-Listener zu den Dropdown-Optionen hinzu.
 * @param {HTMLElement} opts - Die Dropdown-Optionen.
 * @param {Array<Object>} users - Die Liste der Benutzer.
 */
function addOptionsChangeListener(opts, users) {
  opts.addEventListener("change", function () {
    updateAssignedChips(users);
  });
}

/**
 * Aktualisiert die zugewiesenen Chips basierend auf den ausgewählten Benutzern.
 * @param {Array<Object>} users - Die Liste der Benutzer.
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
 * Erstellt das HTML für einen Chip basierend auf der Benutzer-ID.
 * @param {Array<Object>} users - Die Liste der Benutzer.
 * @param {string} userId - Die ID des Benutzers.
 * @returns {string} Das HTML des Chips.
 */
function createChipHTML(users, userId) {
  const user = users.find(u => String(u.id) === String(userId));
  if (!user) return "";
  const initials = getInitials(user.name || user.email);
  return `<div class="assigned-chip" style="background-color: ${user.color};">${initials}</div>`;
}

/**
 * Gibt die Initialen eines Namens oder einer E-Mail zurück.
 * @param {string} [fullName=""] - Der vollständige Name oder die E-Mail-Adresse.
 * @returns {string} Die Initialen.
 */
function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join("");
}

/**
 * Lädt die Benutzer aus Firebase.
 * @returns {Promise<Array<Object>>} Eine Liste der Benutzer.
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
 * Lädt die Kontakte aus Firebase.
 * @returns {Promise<Array<Object>>} Eine Liste der Kontakte.
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