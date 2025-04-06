
/**
 * Asynchronously loads user data from a Firebase database.
 *
 * Fetches data from the specified Firebase login endpoint and parses it into an array of user objects.
 * Each user object contains an `id` property (the key from the Firebase data) and the corresponding user data.
 *
 * @async
 * @function
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects. 
 *                                   Returns an empty array if no data is found or an error occurs.
 * @throws {Error} Logs an error to the console if the fetch operation fails.
 */
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





/**
 * Updates the assigned chips displayed in the UI based on the selected checkboxes.
 * Clears the current chips and adds new ones for each checked user.
 *
 * @param {Array<Object>} users - An array of user objects. Each user object should have a `name` or `email` property.
 * @property {string} [users[].name] - The name of the user.
 * @property {string} [users[].email] - The email of the user.
 */
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


/**
 * Asynchronously loads user data and renders assigned contacts into a dropdown menu.
 * 
 * This function retrieves user data from a storage source identified by the key "login",
 * and dynamically populates the dropdown menu with the ID "assignedDropdownOptions" 
 * using the retrieved user data. Each user is rendered using the `assignedUserTemplate` function.
 * 
 * @async
 * @function
 * @returns {Promise<void>} Resolves when the dropdown is populated or if an error occurs.
 * @throws Will log an error if the dropdown element with the ID "assignedDropdownOptions" is not found.
 */
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
  

/**
 * Retrieves a list of assigned contacts based on checked checkboxes.
 * Each contact is represented as an object containing their ID, name, and email.
 *
 * @returns {Array<{id: string, name: string, email: string}>} An array of assigned contact objects.
 */
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
  

/**
 * Initializes the assigned dropdown functionality.
 * 
 * This function fetches user data from Firebase, populates the dropdown options,
 * and sets up event listeners for toggling the dropdown visibility and updating
 * assigned user chips when selections are made.
 * 
 * @async
 * @function initAssignedDropdown
 * @returns {Promise<void>} Resolves when the dropdown is fully initialized.
 */
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
