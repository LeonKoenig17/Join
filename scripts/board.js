// board.js

let toDoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];

const arrays = [toDoArray, inProgressArray, awaitFeedbackArray, doneArray];
const noTaskHtml = '\
    <div class="noTasks">\
        <span>No tasks To do</span>\
    </div>\
';


/**
 * Lädt und rendert das Board beim Seiten-Load.
 */
async function init() {
  fillUserLinks();
  await fetchData();
  await renderLists();
  setupEventListeners();
  setupSubtaskInputListeners();
}


function setupSubtaskInputListeners() {
  const inputField = document.querySelector("#subtasks input");
  const plus = document.getElementById("subtaskPlus");
  const cross = document.getElementById("subtaskCross");
  const check = document.getElementById("subtaskCheck");

  if (inputField) {
    inputField.addEventListener("input", function() {
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
  const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
  const tasksResponse = await fetch(BASE_URL + "/tasks.json");
  const tasks = await tasksResponse.json();

  let targetKey = null;
  for (const key in tasks) {
    if (tasks[key] && tasks[key].taskIndex === parseInt(taskId, 10)) {
      targetKey = key;
      break;
    }
  }

  if (targetKey) {
    const targetURL = BASE_URL + "/tasks/" + targetKey + ".json";
    const task = tasks[targetKey];
    task.stage = newStage;

    await fetch(targetURL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task)
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
 * Ruft alle Tasks aus Firebase ab und füllt die Arrays.
 */
async function fetchData() {
  const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
  const res = await fetch(BASE_URL + "/tasks.json");
  const tasks = await res.json();

  // Arrays leeren
  for (let i = 0; i < arrays.length; i++) {
    arrays[i].length = 0;
  }

  if (tasks) {
    for (const key in tasks) {
      if (Object.prototype.hasOwnProperty.call(tasks, key)) {
        const task = tasks[key];
        if (task.stage != null) {
          const taskData = {
            id: key,
            taskIndex: task.taskIndex,
            category: task.category,
            title: task.title,
            description: task.description,
            dueDate: task.dueDate,
            priority: task.priority,
            assignedTo: task.assignedTo,
            subtasks: task.subtasks,
            stage: task.stage
          };
          arrays[task.stage].push(taskData);
        }
      }
    }
  }

  renderLists();
}




/**
 * Setzt Drag & Drop und Button-Listener.
 */
function setupEventListeners() {
  const containers = document.querySelectorAll("#boardContent .task-list");
  for (let i = 0; i < containers.length; i++) {
    const container = containers[i];

    container.addEventListener("dragover", function(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });

    container.addEventListener("drop", function(e) {
      e.preventDefault();
      const rawId = e.dataTransfer.getData("text/plain");
      const taskId = parseInt(rawId.replace("task", ""), 10);
      updateStage(container, taskId);
    });
  }

  const addTaskBtn = document.getElementById("addTaskBtn");
  if (addTaskBtn) {
    addTaskBtn.addEventListener("click", function() {
      showAddTaskOverlay();
    });
  }
}

/**
 * Rendert alle vier Spalten des Boards.
 */
/**
 * Rendert alle vier Spalten des Boards – inklusive Header + Add-Task-Button.
 */
async function renderLists() {
  const containers = document.querySelectorAll("#boardContent .task-list");
  const statusLabels = ["To do", "In Progress", "Await Feedback", "Done"];
  const statusKeys   = ["todo",  "inProgress",  "awaitFeedback",  "done"];

  for (let i = 0; i < containers.length; i++) {
    containers[i].innerHTML = `
      <div class="column-header">
        <span>${statusLabels[i]}</span>
        <button
          id="${statusKeys[i]}Btn"
          class="add-task"
          onclick="showAddTaskOverlay('${statusKeys[i]}')"
        ></button>
      </div>
    `;
  }

  for (let column = 0; column < arrays.length; column++) {
    const list = arrays[column];

    if (list.length === 0) {
      containers[column].innerHTML += noTaskHtml;
    } else {
      for (let j = 0; j < list.length; j++) {
        const task = list[j];
        const taskData = {
          id:          task.id,
          taskIndex:   task.taskIndex   || Date.now(),
          category:    task.category    || "User Story",
          title:       task.title       || "",
          description: task.description || "",
          dueDate:     task.dueDate     || new Date().toISOString().split("T")[0],
          priority:    task.priority    || "Medium",
          assignedTo:  task.assignedTo  || [],
          subtasks:    task.subtasks    || [],
          status:      getStatusFromColumnIndex(task.stage || 0)
        };
        containers[column].innerHTML += generateTaskCard(taskData);
      }
    }
  }

  addDragFunction();
  await applyUserColors();
}


/**
 * Wendet User-Farben auf Task-Avatare an.
 */
async function applyUserColors() {
  try {
    const users = await loadUsers();
    const userEls = document.querySelectorAll(".task-assignee");

    for (let i = 0; i < userEls.length; i++) {
      const el = userEls[i];
      const userId = el.getAttribute("data-user-id");
      for (let j = 0; j < users.length; j++) {
        if (users[j].id === userId) {
          el.style.backgroundColor = users[j].color;
          break;
        }
      }
    }
  } catch (error) {
    console.error("Fehler beim Anwenden der Benutzerfarben:", error);
  }
}

/**
 * Erstellt einen neuen Task und zeigt das Overlay.
 *
function createNewTask(status) {
  const taskData = {
    id: Date.now().toString(),
    category: "User Story",
    title: "Neue Aufgabe",
    description: "",
    dueDate: new Date().toISOString().split("T")[0],
    priority: "Medium",
    assignedTo: [],
    subtasks: [],
    status: status
  };
  showAddTaskOverlay();;
}

/**
 * Wandelt Spaltenindex in Status-String um.
 */
function getStatusFromColumnIndex(columnIndex) {
  const statusMap = {
    0: "todo",
    1: "inProgress",
    2: "awaitFeedback",
    3: "done"
  };
  return statusMap[columnIndex] || "todo";
}

/**
 * Macht alle Task-Elemente draggable.
 */
function addDragFunction() {
  const tasks = document.querySelectorAll(".task");
  for (let i = 0; i < tasks.length; i++) {
    const task = tasks[i];
    task.setAttribute("draggable", "true");
    task.addEventListener("dragstart", function(e) {
      console.log("Drag started for task:", task.id);
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
    });
  }
}

function showUserLinksOptions() {
  document.getElementById("userLinkOptions").classList.toggle("hide")
}

