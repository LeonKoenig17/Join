

/** 1) Lädt Benutzer aus Firebase (Knoten "login") */
async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return [];
    return Object.keys(data).map(id => ({ id, ...data[id] }));
  } catch (e) {
    console.error("Fehler beim Laden:", e);
    return [];
  }
}

/** 2) Berechnet die Initialen eines Namens oder E-Mails */
function getInitials(str) {
  return str.split(" ").map(s => s[0].toUpperCase()).join("");
}


/** 4) Erstellt/aktualisiert die "Chips" (Kreise) der ausgewählten User */
function updateAssignedChips(users) {
  const c = document.getElementById("assignedChips");
  c.innerHTML = "";
  document.querySelectorAll(".assign-checkbox").forEach(cb => {
    if (cb.checked) {
      const idx = parseInt(cb.dataset.userIndex);
      const u = users[idx];
      const i = getInitials(u.name || u.email);
      c.innerHTML += `<div class="assigned-chip">${i}</div>`;
    }
  });
}


async function loadAndRenderAssignedContacts() {
    const users = await loadData("login");
    const opts = document.getElementById("assignedDropdownOptions");
    if (!opts) {
      console.error("Element with id 'assignedDropdownOptions' not found!");
      return;
    }
    if (users) {
      const keys = Object.keys(users);
      for (let i = 0; i < keys.length; i++) {
        const id = keys[i],
              user = users[id];
        opts.innerHTML += assignedUserTemplate(user, i);
      }
    }
  }
  

  function getAssignedContacts() {
    const checkboxes = document.querySelectorAll(".assign-checkbox");
    const assigned = [];
    checkboxes.forEach(cb => {
      if (cb.checked) {
        assigned.push({
          id: cb.dataset.userId,
          name: cb.dataset.userName,
          email: cb.dataset.userEmail
        });
      }
    });
    return assigned;
  }
  

/** 5) Initialisiert das benutzerdefinierte Assigned-to-Dropdown */
async function initAssignedDropdown() {
  const users = await loadFirebaseUsers();
  const opts = document.getElementById("assignedDropdownOptions");
  const sel = document.getElementById("assignedDropdownSelected");
  const dd = document.getElementById("assignedDropdown");
  opts.innerHTML = users.map((u,i)=>assignedUserTemplate(u,i)).join("");
  sel.onclick = e => { e.stopPropagation(); opts.classList.toggle("show"); };
  document.addEventListener("click", e => {
    if (!dd.contains(e.target)) opts.classList.remove("show");
  });
  opts.addEventListener("change", () => updateAssignedChips(users));
}

/** Ruft die Initialisierung auf, sobald das DOM bereit ist */
document.addEventListener("DOMContentLoaded", initAssignedDropdown);
