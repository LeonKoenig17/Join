const BASE_URL = 'https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/';
const iconColors = ['#FF7A00', '#FF5EB3', '#6E52FF', '#9327FF', '#00BEE8', '#1FD7C1', '#FF745E', '#FFA35E', '#FC71FF', '#FFC701', '#0038FF', '#C3FF2B', '#FFE62B', '#FF4646', '#FF4646'];

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
async function postData(path = "", data = {}) {
  await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  });
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
  let myValue = ""
  try {
    myValue = fireBaseContent.login;
  } catch (error) {
    myValue = await loadData('login')
  }

  let myToken = localStorage.getItem('token')
  let myName = myValue[myToken].name;

  try {
    // const initials = myName.split(" ").map(w => w[0].toUpperCase()).join("");
    const initials = getInitials(myName)
    document.getElementById("userLink").innerHTML = initials;
  } catch (error) {
    document.getElementById("userLink").innerHTML = "G";
  }

  try {
    document.getElementById("userName").innerHTML = myName;
  } catch (error) {
    return null;
  }

}

async function loadFromFirebase() {
  fireBaseContent = await loadData();
}

async function lastColor() {
  let ergebnisse = await loadData("login")
  let result = Object.entries(ergebnisse);
  let myLastColor = result.pop()[1].color;
  let found = iconColors.indexOf(myLastColor);

  if (found == (iconColors.length - 1)) { found = 0 } else { found = found + 1 }
  return iconColors[found];
}

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