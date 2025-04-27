// addTaskDropDown.js

/**
 * Initialisiert das Assign-Dropdown für Aufgaben.
 */
async function initAssignedDropdown() {
  try {
    const opts = document.getElementById("assignedDropdownOptions");
    if (!opts) {
      return;
    }

    const users = await loadFirebaseUsers();
    renderDropdownOptions(users);
    applyUserColors();
    setupDropdownEventListeners(users);

  } catch (error) {
    console.error("Fehler beim Initialisieren des Dropdowns:", error);
  }
}

/**
 * Rendert die Optionen im Dropdown.
 */
function renderDropdownOptions(users) {
  const opts = document.getElementById("assignedDropdownOptions");
  if (!opts) {
    return;
  }
  let html = "";
  for (let i = 0; i < users.length; i++) {
    html += assignedUserTemplate(users[i], i);
  }
  opts.innerHTML = html;
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

  sel.addEventListener("click", function(e) {
    e.stopPropagation();
    opts.classList.toggle("show");
  });

  document.addEventListener("click", function(e) {
    if (!dd.contains(e.target)) {
      opts.classList.remove("show");
    }
  });

  opts.addEventListener("change", function() {
    updateAssignedChips(users);
  });
}

/**
 * Lädt Nutzer aus Firebase.
 */
async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const users = [];

    if (!data) {
      return users;
    }

    for (const id in data) {
      if (Object.prototype.hasOwnProperty.call(data, id)) {
        const entry = data[id];
        const userObj = { id: id };
        for (const key in entry) {
          if (Object.prototype.hasOwnProperty.call(entry, key)) {
            userObj[key] = entry[key];
          }
        }
        users.push(userObj);
      }
    }

    return users;
  } catch (e) {
    console.error("Fehler beim Laden der Benutzer aus Firebase:", e);
    return [];
  }
}

/**
 * Wendet die Farben auf Elemente mit der Klasse .user-color an.
 */
function applyUserColors() {
  const userColors = document.querySelectorAll(".user-color");
  for (let i = 0; i < userColors.length; i++) {
    const el = userColors[i];
    const parent = el.parentElement;
    if (!parent) {
      continue;
    }
    const color = parent.getAttribute("data-color");
    if (color) {
      el.style.backgroundColor = color;
    }
  }
}

/**
 * Aktualisiert die Chips für ausgewählte Nutzer.
 */
function updateAssignedChips(users) {
  const chipsContainer = document.getElementById("assignedChips");
  if (!chipsContainer) {
    return;
  }
  chipsContainer.innerHTML = "";

  const checkboxes = document.querySelectorAll(".assign-checkbox");
  for (let i = 0; i < checkboxes.length; i++) {
    const cb = checkboxes[i];
    if (cb.checked) {
      const userIndex = parseInt(cb.dataset.userIndex, 10);
      const user = users[userIndex];
      if (!user) {
        continue;
      }
      const chip = document.createElement("div");
      chip.className = "assigned-chip";
      chip.style.backgroundColor = user.color;
      chip.appendChild(document.createTextNode(getInitials(user.name || user.email)));
      chipsContainer.appendChild(chip);
    }
  }
}

/**
 * Gibt die Initialen eines Namens oder einer E-Mail zurück.
 */
function getInitials(str) {
  if (!str) {
    return '?';
  }
  if (typeof str !== 'string') {
    if (str.name) {
      return getInitials(str.name);
    }
    if (str.email) {
      return getInitials(str.email);
    }
    return '?';
  }
  const parts = str.split(" ");
  let initials = "";
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].length > 0) {
      initials += parts[i].charAt(0).toUpperCase();
    }
  }
  return initials;
}

/**
 * Liest alle angehakten Kontakte aus und gibt sie als Array zurück.
 */
function getAssignedContacts() {
  const checkboxes = document.querySelectorAll(".assign-checkbox");
  const contacts = [];
  for (let i = 0; i < checkboxes.length; i++) {
    const cb = checkboxes[i];
    if (cb.checked) {
      contacts.push({
        id: cb.dataset.userId,
        name: cb.dataset.userName,
        email: cb.dataset.userEmail,
        color: cb.dataset.userColor
      });
    }
  }
  return contacts;
}

document.addEventListener("DOMContentLoaded", initAssignedDropdown);
