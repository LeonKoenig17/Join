let allTasks = [];



async function init() {
  fillUserLinks();
  await fetchData();
  await renderTasks();
  setupDragDrop();
  setupSubtaskInputListeners();
  getCurrentHTML();
  addHelpToPopup();
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
    const [users, contacts] = await Promise.all([
        loadFirebaseUsers(),
        loadFirebaseContacts()
    ]);
    
    const allPeople = [...users, ...contacts];
    const peopleById = allPeople.reduce((map, person) => {
      map[person.id] = person;
      return map;
    }, {});
  
    document.querySelectorAll(".task-assignee").forEach(el => {
      const uid = el.dataset.userId;
      const person = peopleById[uid];
      if (person && person.color) {
        el.style.backgroundColor = person.color;
      }
    });
  } catch (err) {
    console.error("Fehler beim Anwenden der Benutzerfarben:", err);
  }
}


function isMobile() {
  return window.innerWidth <= 800;
}


/**
 * Move search input field to responsive layout
 */
document.addEventListener("DOMContentLoaded", function () {
    const searchInputField = document.getElementById("searchInput");
    const originalParent = document.querySelector("#boardHeader div");
    const newParent = document.getElementById("searchInput-resp-target");

    function moveInputFieldOnResize() {
      if (isMobile()) {
        pressTimer = setTimeout(() => {
          document.querySelectorAll(".task").forEach(task => task.setAttribute("draggable", "false"));
        }, 600);
        if (!newParent.contains(searchInputField)) {
          newParent.appendChild(searchInputField);
        }
      } else {
        document.querySelectorAll(".task").forEach(task => task.setAttribute("draggable", "true"));
        if (!originalParent.contains(searchInputField)) {
          originalParent.insertBefore(searchInputField, originalParent.firstChild);
        }
      }
    }

    window.addEventListener("resize", moveInputFieldOnResize);
    moveInputFieldOnResize(); // Initial run
});