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
 * @function
 * @param {string} [path=""] - The relative path to the resource to be updated.
 * @param {Object} [data={}] - The data to be sent in the request body.
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

async function patchData(path = "", data = {}) {
  // const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/tasks";
  await fetch(BASE_URL + path + ".json", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  // return await response.json();
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

async function loadFromFirebase() {
  fireBaseContent = await loadData();
}

async function lastColor() {
  try {
    const users = await loadData("login");
    if (!users) {
      return '#FF7A00';
    }

    const usedColors = Object.values(users).map(user => user.color);
    const availableColors = [
      '#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FFBB2B'
    ];

    for (const color of availableColors) {
      if (!usedColors.includes(color)) {
        return color;
      }
    }

    return availableColors[0];
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

