// addTaskDropDown.js

/**
 * Initialisiert das Assign-Dropdown für Aufgaben.
 */
async function initAssignedDropdown() {
  try {
    const users = await loadFirebaseUsers();
    renderDropdownOptions(users);
    setupDropdownEventListeners(users);
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

function getInitials(str) {
  if (!str) return "?";
  if (typeof str !== "string") {
    if (str.name) return getInitials(str.name);
    if (str.email) return getInitials(str.email);
    return "?";
  }
  const parts = str.split(" ");
  return parts.map(part => part.charAt(0).toUpperCase()).join("");
}

async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    const users = [];

    if (!data) return users;

    for (const [id, entry] of Object.entries(data)) {
      users.push({ id, ...entry });
    }

    return users;
  } catch (e) {
    console.error("Fehler beim Laden der Benutzer:", e);
    return [];
  }
}



