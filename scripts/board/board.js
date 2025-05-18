let allTasks = [];



async function init() {
  fillUserLinks();
  await fetchData();
  await renderTasks();
  setupDragDrop();
  setupSubtaskInputListeners();
}


function setupSubtaskInputListeners() {
  const inputField = document.querySelector("#subtasks input");
  const plus = document.getElementById("subtaskPlus");
  const cross = document.getElementById("subtaskCross");
  const check = document.getElementById("subtaskCheck");

  if (inputField) {
    inputField.addEventListener("input", function () {
      if (inputField.value.trim() !== "") {
        plus.style.display = "none";
        cross.style.display = "unset";
        check.style.display = "unset";
      } else {
        plus.style.display = "unset";
        cross.style.display = "none";
        check.style.display = "none";
      }
    });
  }
}


/**
 * Aktualisiert die Stage eines Tasks in Firebase.
 */
async function updateStage(container, taskId) {
  const newStage = getStageFromContainer(container.id);
  const tasksResponse = await fetch(BASE_URL + "/tasks.json");
  const tasks = await tasksResponse.json();

  const task = tasks[taskId];
  if (task) {
    task.stage = newStage;

    const targetURL = BASE_URL + "/tasks/" + taskId + ".json";

    await fetch(targetURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    await fetchData();
  }
}


/**
 * Wandelt Container-ID in Stage-Index um.
 */
function getStageFromContainer(containerId) {
  switch (containerId) {
    case "toDo":
      return 0;
    case "inProgress":
      return 1;
    case "awaitFeedback":
      return 2;
    case "done":
      return 3;
    default:
      return 0;
  }
}


/**
 * Ruft alle Tasks aus Firebase ab und füllt das globale allTasks-Array.
 */
async function fetchData() {
  const res = await fetch(BASE_URL + "/tasks.json");
  const tasks = await res.json();
  allTasks = [];

  if (tasks) {
    for (const key in tasks) {
      const task = tasks[key];
      if (task.stage != null) {
        allTasks.push({ ...task, id: key });
      }
    }
  }

  renderTasks();
}


/**
 * Rendert alle vier Spalten des Boards.
 */
async function renderTasks() {
  const containers = document.querySelectorAll("#boardContent .task-list");
  renderColumnBtns(containers);

  for (let i = 0; i < 4; i++) {
    const stageTasks = allTasks.filter(task => task.stage === i);
    if (stageTasks.length === 0) {
      containers[i].innerHTML += noTaskHtml;
    } else {
      stageTasks.forEach(task => {
        containers[i].innerHTML += generateTaskCard(task);
      });
    }
  }

  addDragFunction();
  await applyUserColors();
}


function renderColumnBtns(containers) {
  const statusLabels = ["To do", "In Progress", "Await Feedback", "Done"];
  const statusKeys = ["todo", "inProgress", "awaitFeedback", "done"];

  containers.forEach((container, i) => {
    container.innerHTML = columnBtnTemplate(statusLabels[i], statusKeys[i]);
  });
  return containers;
}


/**
 * Wendet Farben auf Task-Avatare an.
 */
async function applyUserColors() {
  try {
    const users = await loadUsers();
    const userEls = document.querySelectorAll(".task-assignee");
    userEls.forEach(el => {
      const userId = el.getAttribute("data-user-id");
      const user = users.find(u => u.id === userId);
      if (user) el.style.backgroundColor = user.color;
    });
  } catch (error) {
    console.error("Fehler beim Anwenden der Benutzerfarben:", error);
  }
}


/**
 * Setzt Drag & Drop und Event-Listener für Buttons.
 */
function setupDragDrop() {
  const containers = document.querySelectorAll("#boardContent .task-list");

  containers.forEach(container => {
    container.addEventListener("dragover", function (e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    container.addEventListener("drop", function (e) {
      e.preventDefault();
      const rawId = e.dataTransfer.getData("text/plain");
      const taskId = rawId.replace("task", "");
      updateStage(container, taskId);
    });
  });

  const addTaskBtn = document.getElementById("addTaskBtn");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function () {
      showAddTaskOverlay();
    });
  }
}


/**
 * Macht Tasks draggable.
 */
function addDragFunction() {
  const tasks = document.querySelectorAll(".task");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", function (e) {
      console.log("Drag started for task:", task.id);
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
    });
  }
}


/**
 * Öffnet/Schließt das Benutzermenü.
 */
function showUserLinksOptions() {
  document.getElementById("userLinkOptions").classList.toggle("hide");
  document.getElementById("userLinkOptionsBackground").classList.toggle("hide");

}

function updateDraggable() {
    const isSmallScreen = window.matchMedia("(max-width: 800px)").matches;
    const tasks = document.querySelectorAll(".task");
    tasks.forEach(task => {
      task.setAttribute("draggable", !isSmallScreen);
    })
  }

// Run on load
updateDraggable();

// Run on resize
window.addEventListener("resize", updateDraggable);