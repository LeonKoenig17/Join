async function openOverlay(taskIndex) {
  try {
    const tasks = await loadData("tasks");

    for (const key in tasks) {
      if (tasks[key].taskIndex === taskIndex) {
        foundTask = { id: key, ...tasks[key] };
        break;
      }
    }

    if (!foundTask) {
      console.error("Task with index", taskIndex, "not found.");
      return;
    }

    const overlayContainer = document.getElementById("task-Overlay");

    overlayContainer.innerHTML = editOverlayTemplate(foundTask);
    overlayContainer.classList.remove("d-none");

  } catch (error) {
    console.error("Error loading task data:", error);
  }
}

function closeOverlay() {
  const overlayContainer = document.getElementById("task-Overlay");
  overlayContainer.classList.add("d-none");
  overlayContainer.innerHTML = "";
}

async function loadFirebaseUsers() {
  const url = BASE_URL + "login.json";
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (!data) {
      console.warn("Keine User im 'login'-Knoten gefunden");
      return [];
    }
    
    const users = Object.keys(data).map((id) => ({
      id,
      ...data[id],
    }));

    return users;
  } catch (e) {
    console.error("Fehler beim Laden der Benutzer aus Firebase:", e);
    return [];
  }
}