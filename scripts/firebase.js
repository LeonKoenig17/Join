const BASE_URL = 'https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/';

/**
 * Asynchronously loads JSON data from a specified path.
 *
 * @param {string} [path=""] - The relative path to the JSON file (excluding the ".json" extension).
 * @returns {Promise<any>} A promise that resolves to the parsed JSON data.
 * @throws {Error} If the fetch request fails or the response cannot be parsed as JSON.
 */
async function loadData(path = "") {
  const response = await fetch(BASE_URL + path + ".json");
  return await response.json();
}


/**
 * Sends a POST request to the specified path with the provided data.
 *
 * @async
 * @function postData
 * @param {string} path - The endpoint path to which the data will be sent (relative to the base URL).
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function postData(path, data) {
  const response = await fetch(`${BASE_URL}${path}.json`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await response.json();
}


/**
 * Sends a PATCH request to update data at the specified path on the server.
 *
 * @async
 * @function patchTask
 * @param {string} taskId - The ID of the task to be updated.
 * @param {Object} data - The data to be sent in the request body.
 * @returns {Promise<Object>} A promise that resolves to the JSON response from the server.
 */
async function patchTask(taskId, data) {
  const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/tasks";
  const response = await fetch(`${BASE_URL}/${taskId}.json`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  return await response.json();
}


/**
 * Sends a PATCH request to update data at the specified path on the server.
 *
 * @async
 * @function patchData
 * @param {string} [path=""] - The relative path to the resource to be updated.
 * @param {Object} [data={}] - The data to be sent in the request body.
 */
async function patchData(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
}


async function putData(path = "", data = {}) {
  const targetURL = BASE_URL + path + ".json";
  const response = await fetch(targetURL, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await response.json();
}


/**
 * Deletes data from the specified path on the server.
 *
 * @async
 * @function deleteData
 * @param {string} [path=""] - The relative path to the resource to be deleted.
 * @returns {Promise<Object>} A promise that resolves to an object indicating the success of the operation.
 *                             If the response contains JSON, it will return the parsed JSON object.
 *                             If an error occurs or no JSON is returned, it defaults to `{ success: true }`.
 */
async function deleteData(path = "") {
  await fetch(BASE_URL + path + ".json", {
    method: "DELETE"
  });
}


/**
 * Loads all users from Firebase and returns them as an array of objects.
 *
 * @async
 * @function loadUsers
 * @returns {Promise<Array<Object>>} A list of users with their details.
 */
async function loadUsers() {
  try {
    const usersObj = await loadData("login");
    const result = [];

    if (!usersObj) {
      return result;
    }

    for (const [id, user] of Object.entries(usersObj)) {
      const color = user.color || '#A8A8A8';

      result.push({
        id: id,
        name: user.name || '',
        email: user.email || '',
        color: color
      });
    }

    return result;
  } catch (error) {
    console.error("Fehler beim Laden der Benutzer:", error);
    return [];
  }
}


/**
 * Applies user-specific colors to task assignee elements in the DOM.
 *
 * @async
 * @function applyUserColors
 */
async function applyUserColors() {
  try {
    const users = await loadUsers();
    const userElements = document.querySelectorAll('.task-assignee');

    userElements.forEach(function (el) {
      const userId = el.getAttribute('data-user-id');

      for (const user of users) {
        if (user.id === userId) {
          el.style.backgroundColor = user.color;
          break;
        }
      }
    });
  } catch (error) {
    console.error("Fehler beim Anwenden der Benutzerfarben:", error);
  }
}


/**
 * Fills user links in the UI based on the current user.
 *
 * @async
 * @function fillUserLinks
 */
async function fillUserLinks() {
  try {
    const allUsers = await loadAllUsers();
    const myToken = localStorage.getItem("token");
    const currentUser = allUsers.find(user => user.id === myToken);

    if (!currentUser) {
      const userLinkElement = document.getElementById("userLink");
      if (userLinkElement) userLinkElement.innerHTML = "G";
      const userNameElement = document.getElementById("userName");
      if (userNameElement) userNameElement.innerHTML = "";
      return;
    }

    const initials = getInitials(currentUser.name);
    const userLinkElement = document.getElementById("userLink");
    if (userLinkElement) userLinkElement.innerHTML = initials;

    const userNameElement = document.getElementById("userName");
    if (userNameElement) {
      userNameElement.innerHTML = currentUser.name !== "Guest" ? currentUser.name : "";
    }
  } catch (error) {
    console.error("Fehler beim Aktualisieren der Benutzerlinks:", error);
  }
}


/**
 * Loads all data from Firebase into a global variable.
 *
 * @async
 * @function loadFromFirebase
 */
async function loadFromFirebase() {
  fireBaseContent = await loadData();
}


/**
 * Retrieves the next available color for a user from Firebase.
 *
 * @async
 * @function lastColor
 * @returns {Promise<string>} The next available color as a hex code.
 */
async function lastColor() {
  try {
    const users = await loadData("login");
    if (!users) return '#FF7A00';

    const usedColors = Object.values(users).map(user => user.color);
    const availableColors = [
      '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1',
      '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF',
      '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
    ];

    const unusedColor = availableColors.find(color => !usedColors.includes(color));
    if (unusedColor) return unusedColor;

    const lastUsedColor = [...usedColors].reverse().find(color => availableColors.includes(color));
    const nextIndex = lastUsedColor
      ? (availableColors.indexOf(lastUsedColor) + 1) % availableColors.length
      : 0;

    return availableColors[nextIndex];
  } catch (error) {
    console.error("Fehler beim Abrufen der letzten Farbe:", error);
    return '#FF7A00';
  }
}


/**
 * Returns the initials of a given full name.
 *
 * @param {string} [element] - The full name from which to extract initials.
 * @returns {string} The initials in uppercase letters.
 */
function getInitials(element) {
  let completeName = element.split(" ");
  let firstName = completeName[0]

  if (completeName.length == 1) {
    return firstName[0];
  } else {
    let lastName = (completeName.length == 1) ? "" : completeName[completeName.length - 1];
    return firstName[0] + lastName[0];
  }
}


/**
 * Loads all users and contacts from Firebase and combines them into a single list.
 *
 * @async
 * @function loadAllUsers
 * @returns {Promise<Array<Object>>} A combined list of users and contacts.
 */
async function loadAllUsers() {
  try {
    const [users, contacts] = await Promise.all([
      loadData("login"),
      loadData("contacts")
    ]);

    const allPeople = { ...users, ...contacts };
    return Object.entries(allPeople).map(([id, person]) => ({
      id,
      name: person.name || "",
      color: person.color || "#A8A8A8",
      email: person.email || ""
    }));
  } catch (error) {
    console.error("Fehler beim Laden aller Benutzer:", error);
    return [];
  }
}

