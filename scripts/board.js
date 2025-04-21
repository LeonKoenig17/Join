let toDoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];

const firebaseTasks = [];
const arrays = [toDoArray, inProgressArray, awaitFeedbackArray, doneArray];
const noTaskHtml = `
    <div class="noTasks">
        <span>No tasks To do</span>
    </div>
`;

window.onload = async () => {
  await initBoard();
  await renderLists();
};

const inputField = document.querySelector("#subtasks input");
const plus = document.getElementById("subtaskPlus");
const cross = document.getElementById("subtaskCross");
const check = document.getElementById("subtaskCheck");

if (inputField) {
  inputField.addEventListener("input", () => {
    if (inputField.value.trim() != "") {
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

async function updateStage(container, taskId) {
  const newStage = getStageFromContainer(container.id);

  const BASE_URL =
    "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
  const tasks = await fetch(BASE_URL + "/tasks.json").then((res) => res.json());

  let targetKey = null;

  for (const [key, task] of Object.entries(tasks)) {
    if (task.taskIndex === parseInt(taskId)) {
      targetKey = key;
      break;
    }
  }

  if (targetKey) {
    const targetURL = `${BASE_URL}/tasks/${targetKey}.json`;
    const task = tasks[targetKey];
    task.stage = newStage;

    await fetch(targetURL, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    await fetchData();
  }
}

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

async function fetchData() {
  const BASE_URL =
    "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
  const tasks = await fetch(BASE_URL + "/tasks.json").then((res) => res.json());

  arrays.forEach((array) => (array.length = 0));

  if (tasks) {
    Object.entries(tasks).forEach(([key, task]) => {
      const taskData = {
        id: key,
        ...task,
      };

      if (task.stage != null) {
        arrays[task.stage].push(taskData);
      }
    });
  }

  renderLists();
}

/**
 * Initialisiert das Board
 */
async function initBoard() {
    await fetchData();
    setupEventListeners();
}

/**
 * Setzt Event-Listener für das Board
 */
function setupEventListeners() {
  const containers = document.querySelectorAll("#boardContent > div");
  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
    });
    
    container.addEventListener("drop", async (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("text/plain");
      console.log("Dropped task:", id);
      const taskId = parseInt(id.replace("task", ""));
      await updateStage(container, taskId);
    });
  });

  // Event-Listener für den "Add Task" Button
  const addTaskBtn = document.getElementById('addTaskBtn');
  if (addTaskBtn) {
    addTaskBtn.addEventListener('click', () => createNewTask('todo'));
  }
}

async function renderLists() {
    const containers = document.querySelectorAll("#boardContent > div");
    containers.forEach((container) => {
        container.innerHTML = "";
    });

    for (let i = 0; i < arrays.length; i++) {
        arrays[i].forEach((task) => {
            const taskData = {
                id: task.id,
                taskIndex: task.taskIndex || Date.now(), // Stelle sicher, dass taskIndex existiert
                category: task.category || 'User Story',
                title: task.title || '',
                description: task.description || '',
                dueDate: task.dueDate || new Date().toISOString().split('T')[0],
                priority: task.priority || 'Medium',
                assignedTo: task.assignedTo || [],
                subtasks: task.subtasks ? Object.values(task.subtasks).map((subtask, index) => ({
                    id: 'subtask-' + index,
                    text: subtask.name || subtask,
                    completed: subtask === 'ticked'
                })) : [],
                status: getStatusFromColumnIndex(task.stage || 0)
            };

            containers[i].innerHTML += generateTaskCard(taskData);
        });
    }

    containers.forEach((container) => {
        if (container.innerHTML === "") {
            container.innerHTML = `<div class="noTasks"><span>No tasks to do</span></div>`;
        }
    });

    // Füge Drag & Drop Funktionalität hinzu
    addDragFunction();
    
    // Wende die Benutzerfarben an
    await applyUserColors();
}

async function applyUserColors() {
    try {
        const users = await loadUsers();
        const userElements = document.querySelectorAll('.task-assignee');
        
        userElements.forEach(element => {
            const userId = element.dataset.userId;
            const user = users.find(u => u.id === userId);
            if (user) {
                element.style.backgroundColor = user.color;
            }
        });
    } catch (error) {
        console.error("Fehler beim Anwenden der Benutzerfarben:", error);
    }
}

/**
 * Erstellt einen neuen Task mit Standardwerten
 * @param {string} status - Der Status des neuen Tasks
 */
function createNewTask(status) {
  const taskData = {
    id: Date.now().toString(),
    category: 'User Story',
    title: 'Neue Aufgabe',
    description: '',
    dueDate: new Date().toISOString().split('T')[0],
    priority: 'Medium',
    assignedTo: [],
    subtasks: [],
    status: status
  };
  showTaskOverlay(taskData);
}

/**
 * Konvertiert den Spaltenindex in einen Status-String
 * @param {number} columnIndex - Der Index der Spalte
 * @returns {string} Der entsprechende Status
 */
function getStatusFromColumnIndex(columnIndex) {
  const statusMap = {
    0: 'todo',
    1: 'inProgress',
    2: 'awaitFeedback',
    3: 'done'
  };
  return statusMap[columnIndex] || 'todo';
}

function addDragFunction() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.setAttribute('draggable', 'true');
    task.addEventListener("dragstart", (e) => {
      console.log("Drag started for task:", task.id);
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
    });
  });
}
