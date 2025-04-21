async function initAssignedDropdown() {
  try {
    const opts = document.getElementById("assignedDropdownOptions");
    if (!opts) return;

    const users = await loadFirebaseUsers();
    renderDropdownOptions(users);
    applyUserColors();
    setupDropdownEventListeners(users);
  } catch (error) {
    console.error("Fehler beim Initialisieren des Dropdowns:", error);
  }
}

function renderDropdownOptions(users) {
  const opts = document.getElementById("assignedDropdownOptions");
  if (!opts) return;
  opts.innerHTML = users.map((u, i) => assignedUserTemplate(u, i)).join("");
}

function setupDropdownEventListeners(users) {
  const sel = document.getElementById("assignedDropdownSelected");
  const opts = document.getElementById("assignedDropdownOptions");
  const dd = document.getElementById("assignedDropdown");

  if (!sel || !opts || !dd) return;

  sel.addEventListener("click", (e) => {
    e.stopPropagation();
    opts.classList.toggle("show");
  });

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) {
      opts.classList.remove("show");
    }
  });

  opts.addEventListener("change", () => updateAssignedChips(users));
}

async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return [];
    
    return Object.keys(data).map((id) => ({
      id,
      ...data[id],
    }));
  } catch (e) {
    console.error("Fehler beim Laden der Benutzer aus Firebase:", e);
    return [];
  }
}

function applyUserColors() {
  const userColors = document.querySelectorAll(".user-color");
  userColors.forEach((el) => {
    const color = el.parentElement.getAttribute("data-color");
    if (color) {
      el.style.backgroundColor = color;
    }
  });
}

function updateAssignedChips(users) {
  const chipsContainer = document.getElementById("assignedChips");
  if (!chipsContainer) return;
  
  chipsContainer.innerHTML = "";
  document.querySelectorAll(".assign-checkbox").forEach((checkbox) => {
    if (checkbox.checked) {
      const userIndex = parseInt(checkbox.dataset.userIndex);
      const user = users[userIndex];
      if (!user) return;

      chipsContainer.innerHTML += `
        <div class="assigned-chip" style="background-color: ${user.color};">
          ${getInitials(user.name || user.email)}
        </div>
      `;
    }
  });
}

function getInitials(str) {
  if (!str) return '?';
  if (typeof str !== 'string') {
    if (str.name) return getInitials(str.name);
    if (str.email) return getInitials(str.email);
    return '?';
  }
  return str.split(" ").map(s => s[0].toUpperCase()).join("");
}

function getAssignedContacts() {
  const checkboxes = document.querySelectorAll(".assign-checkbox");
  return Array.from(checkboxes)
    .filter(cb => cb.checked)
    .map(cb => ({
      id: cb.dataset.userId,
      name: cb.dataset.userName,
      email: cb.dataset.userEmail,
      color: cb.dataset.userColor,
    }));
}

document.addEventListener("DOMContentLoaded", initAssignedDropdown);