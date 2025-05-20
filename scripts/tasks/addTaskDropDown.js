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
 */
function setupDropdownEventListeners(users) {
  const sel = document.getElementById("assignedDropdownSelected");
  const opts = document.getElementById("assignedDropdownOptions");
  const dd = document.getElementById("assignedDropdown");

  if (!sel || !opts || !dd) {
    return;
  }

  sel.addEventListener("click", function (e) {
    e.stopPropagation();
    opts.classList.toggle("show");
  });

  document.addEventListener("click", function (e) {
    if (!dd.contains(e.target)) {
      opts.classList.remove("show");
    }
  });

  opts.addEventListener("change", function () {
    updateAssignedChips(users);
  });
}

function updateAssignedChips(users) {
  const chipsContainer = document.getElementById("assignedChips");
  if (!chipsContainer) return;

  const checkboxes = document.querySelectorAll(".assign-checkbox");
  const chips = [];

  checkboxes.forEach((cb) => {
    if (cb.checked) {
      const user = users.find(u => String(u.id) === String(cb.dataset.userId));
      if (!user) return;
      const initials = getInitials(user.name || user.email);
      const chipHTML = `<div class="assigned-chip" style="background-color: ${user.color};">${initials}</div>`;
      chips.push(chipHTML);

    }
  });

  chipsContainer.innerHTML = chips.join("");
}


/**
 * Gibt die Initialen eines Namens oder einer E-Mail zurück.
 */

function getInitials(fullName = "") {
  return fullName
    .split(" ")
    .filter(Boolean)
    .map(n => n[0].toUpperCase())
    .join("");
}


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