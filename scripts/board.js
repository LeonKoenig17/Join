let exammpleTaskObject = {
    title: "Title",
    description: "description",
    dueDate: "02/05/2025",
    priority: 1, // index: urgent
    assignedTo: 0, // index
    category: 1, // index
    subtasks: [{"task1": "ticked"}, {"task2": "unticked"}],
    stage: 0, // toDoArray
    index: 100,
};

let toDoArray = [];
let inProgressArray = [];
let awaitFeedbackArray = [];
let doneArray = [];

const arrays = [toDoArray, inProgressArray, awaitFeedbackArray, doneArray];
const noTaskHtml = `
    <div class="noTasks">
        <span>No tasks To do</span>
    </div>
`;

window.onload = () => {
    fetchData();
    renderLists();
    addDragFunction();

    const containers = document.querySelectorAll("#boardContent > div");
    containers.forEach(container => {
        container.addEventListener("dragover", (e) => e.preventDefault());
        container.addEventListener("drop", (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("task");
            const taskId = parseInt(id.replace("task", ""));
            let task = null;

            for (const arr of arrays) {
                const index = arr.findIndex(t => t.index === taskId);
                if (index !== -1) {
                    task = arr.splice(index, 1)[0]; // remove the task from original array
                    break;
                }
            }
            if (!task) return;
            switch (container.id) {
                case "toDo": toDoArray.push(task); break;
                case "inProgress": inProgressArray.push(task); break;
                case "awaitFeedback": awaitFeedbackArray.push(task); break;
                case "done": doneArray.push(task); break;
                default: break;
            }
            renderLists();
            addDragFunction();
        })
    })
}

async function fetchData() {
    const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
    const data = await fetch(BASE_URL + ".json").then(res => res.json());
    console.log(data);
}

function addDragFunction() {
    const tasks  = document.querySelectorAll(".task");

    tasks.forEach(task => {
        task.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("task", task.id);
        })
    });
}


function renderLists() {
    const containers = document.querySelectorAll("#boardContent > div");
    containers.forEach(e => {
        e.innerHTML = "";
    });
    for (let i = 0; i < arrays.length; i++) {
        arrays[i].forEach(task => {
            containers[i].innerHTML += `
                <div id="task${task.index}" class="task" draggable="true">
                    <span>${task.title}</span>
                </div>
            `;
        })
    }
    containers.forEach(e => {
        if (e.innerHTML == "") {
            e.innerHTML = noTaskHtml;
        }
    })
}

let targetIndex = 0;

function openOverlay(index) {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    addTaskOverlay.style.display = "flex";
    targetIndex = index;
}

function clearInputFields() {
    const allInputs = document.querySelectorAll("#addTaskOverlay input, #addTaskOverlay textarea");
    allInputs.forEach(input => input.value = "");
}

function closeOverlay() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    addTaskOverlay.style.display = "none";
    clearInputFields();
}

function addTask() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    const title = addTaskOverlay.querySelector("input").value.trim();
    const taskIndex = arrays.reduce((sum, arr) => sum + arr.length, 0) + 1;
    
    arrays[targetIndex].push({
        title: title,
        index: taskIndex
    })

    clearInputFields();
    closeOverlay();
    renderLists();
    addDragFunction();
}