

/** 1) Lädt Benutzer aus Firebase (Knoten "login") */
async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) return [];
    
    // Konvertiere die Firebase-Daten in ein Array von Benutzern
    const users = Object.keys(data).map((id) => ({
      id, // Firebase-Schlüssel als Benutzer-ID
      ...data[id], // Restliche Daten wie name, email, color
    }));

    return users;
  } catch (e) {
    console.error("Fehler beim Laden der Benutzer aus Firebase:", e);
    return [];
  }
}

/** 2) Berechnet die Initialen eines Namens oder E-Mails */
function getInitials(str) {
  return str.split(" ").map(s => s[0].toUpperCase()).join("");
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

// Rufe diese Funktion nach dem Rendern der Benutzer auf
applyUserColors();


function updateAssignedChips(users) {
  const chipsContainer = document.getElementById("assignedChips");
  chipsContainer.innerHTML = ""; // Leere die Chips, bevor neue hinzugefügt werden

  document.querySelectorAll(".assign-checkbox").forEach((checkbox) => {
    if (checkbox.checked) {
      const userIndex = parseInt(checkbox.dataset.userIndex);
      const user = users[userIndex];

      // Erstelle den Chip mit der richtigen Farbe
      const chip = `
        <div class="assigned-chip" style="background-color: ${user.color};">
          ${getInitials(user.name || user.email)}
        </div>
      `;
      chipsContainer.innerHTML += chip;
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

  opts.innerHTML = "";

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
  
  function applyUserColors() {
    const userColors = document.querySelectorAll(".user-color");
    userColors.forEach((el) => {
      const color = el.parentElement.getAttribute("data-color");
      if (color) {
        el.style.backgroundColor = color;
      }
    });
  }
 

  async function initAssignedDropdown() {
  const users = await loadFirebaseUsers();
  const opts = document.getElementById("assignedDropdownOptions");
  const sel = document.getElementById("assignedDropdownSelected");
  const dd = document.getElementById("assignedDropdown");

  // Leere das Dropdown-Menü, bevor neue Optionen hinzugefügt werden
  opts.innerHTML = "";

  // Füge die Benutzer als Optionen hinzu
  opts.innerHTML = users.map((u, i) => assignedUserTemplate(u, i)).join("");

  // Wende die Farben an
  applyUserColors();

  sel.onclick = (e) => {
    e.stopPropagation();
    opts.classList.toggle("show");
  };

  document.addEventListener("click", (e) => {
    if (!dd.contains(e.target)) opts.classList.remove("show");
  });

  opts.addEventListener("change", () => updateAssignedChips(users));
}

document.addEventListener("DOMContentLoaded", initAssignedDropdown);
