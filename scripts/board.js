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
  await fetchData();

  const containers = document.querySelectorAll("#boardContent > div");
  containers.forEach((container) => {
    container.addEventListener("dragover", (e) => e.preventDefault());
    container.addEventListener("drop", async (e) => {
      e.preventDefault();
      const id = e.dataTransfer.getData("task");
      const taskId = parseInt(id.replace("task", ""));
      await updateStage(container, taskId);
    });
  });

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
  addDragFunction();
}

function addDragFunction() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach((task) => {
    task.addEventListener("dragstart", (e) => {
      console.log("Drag started for task:", task.id);
      e.dataTransfer.setData("task", task.id);
    });
  });
}

function renderLists() {
  const containers = document.querySelectorAll("#boardContent > div");
  containers.forEach((container) => {
    container.innerHTML = "";
  });

  for (let i = 0; i < arrays.length; i++) {
    arrays[i].forEach((task) => {

      const subtasks = task.subtasks || {};
      containers[i].innerHTML += `
        <div id="task${task.taskIndex}" class="task" draggable="true" onclick="openOverlay(${task.taskIndex})">
          <p>Category: ${task.category}</p>
          <h3>${task.title}</h3>
          <p>${task.description}</p>
          <p>Due: ${task.dueDate}</p>
          <p>Priority: ${task.priority}</p>
          <p>Subtasks: ${Object.values(subtasks)
            .map((subtask) => subtask.name || subtask)
            .join(", ")}</p>
          <p>Assigned to: ${(Array.isArray(task.assignedTo) ? task.assignedTo
            .map((user) => user.name || user.email)
            .join(", ") : "None")}</p>
        </div>
      `;
    });
  }

  containers.forEach((container) => {
    if (container.innerHTML === "") {
      container.innerHTML = `<div class="noTasks"><span>No tasks to do</span></div>`;
    }
  });
}


let targetIndex = 0;

/*function openOverlay(index) {
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  addTaskOverlay.style.display = "flex";
  targetIndex = index;
}

function clearInputFields() {
  const allInputs = document.querySelectorAll(
    "#addTaskOverlay input, #addTaskOverlay textarea"
  );
  allInputs.forEach((input) => (input.value = ""));
}

function closeOverlay() {
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  addTaskOverlay.style.display = "none";
  clearInputFields();
}*/

async function addTask() {
  const addTaskOverlay = document.getElementById("addTaskOverlay");
  const title = addTaskOverlay.querySelector("#title").value.trim();
  const dueDate = addTaskOverlay.querySelector("#dueDate").value;
  const category = addTaskOverlay.querySelector("#category .dropDown span");
  let inputValid;

  const description = addTaskOverlay.querySelector("#description").value;
  let priority = addTaskOverlay.querySelector(".selectedPrio");
  console.log(priority);
  if (priority == null) {
    priority = "";
  }

  if (
    title != "" &&
    dueDate != "" &&
    category.textContent != "Select task category"
  ) {
    inputValid = true;
  } else {
    inputValid = false;
  }

  if (!inputValid) {
    console.log("input invalid");
    return;
  } else {
    const BASE_URL =
      "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
    const tasks = await fetch(BASE_URL + "/tasks.json").then((res) =>
      res.json()
    );
    let number = (await Object.entries(tasks).length) + 1;

    console.log("input valid, data posted");
    await postData("tasks", {
      title: title,
      description: description,
      dueDate: dueDate,
      priority: priority,
      assignedTo: "",
      category: category.textContent,
      subtasks: { task1: "ticked", task2: "unticked" },
      stage: targetIndex,
      index: number,
    });
  }

  clearInputFields();
  closeOverlay();
  fetchData();
}

async function postData(path, data) {
  const BASE_URL =
    "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
  await fetch(BASE_URL + path + ".json", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
}

function toggleDropMenu(id) {
  const container = document.getElementById(id);
  const selection = container.querySelector(".dropSelection");
  selection.classList.toggle("toggleSelection");
  const arrow = container.querySelector("i");
  if (selection.classList.contains("toggleSelection")) {
    arrow.style.backgroundImage = "url(../images/arrowUp.svg)";
  } else {
    arrow.style.backgroundImage = "url(../images/arrowDown.svg)";
  }
}

function selectCategory(selected) {
  const parent = selected.parentElement.parentElement;
  const inputField = parent.querySelector(".dropDown span");
  inputField.textContent = selected.textContent;
  toggleDropMenu(parent.id);
}

function selectPrio(id) {
  const prioBtns = document.querySelectorAll("#priorityBtns button");
  prioBtns.forEach((btn) => {
    btn.classList.remove("selectedPrio");
  });

  const selected = document.getElementById(id);
  selected.classList.add("selectedPrio");
}}


