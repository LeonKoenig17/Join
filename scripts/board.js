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
    const tasks = await fetch(BASE_URL + "/tasks.json").then(res => res.json());
    console.log(tasks);

    if (tasks) {
        Object.entries(tasks).forEach(entry => {
            let task = entry[1];
            let taskData = {
                title: task.title,
                description: task.description,
                dueDate: task.dueDate,
                priority: task.priority,
                assignedTo: task.assignedTo,
                category: task.category,
                subtasks: task.subtasks,
                stage: task.stage,
                index: getTaskNumber(),
            }
            if (task.stage != null) {
                arrays[task.stage].push(taskData);
                console.log(task.stage, taskData);
            }
        })

        renderLists();
        addDragFunction();
    }
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
                    <p>${task.title}</p>
                    <p>${task.description}</p>
                    <p>${task.dueDate}</p>
                    <p>${task.priority}</p>
                    <p>${task.assignedTo}</p>
                    <p>${task.subtasks}</p>
                    <p>${task.category}</p>
                    <p>${task.stage}</p>
                    <p>${task.index}</p>
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

function getTaskNumber() {
    let number = arrays.reduce((sum, arr) => sum + arr.length, 0) + 1;
    return number;
}

function addTask() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    const title = addTaskOverlay.querySelector("#title").value.trim();
    const dueDate = addTaskOverlay.querySelector("#dueDate").value;
    const category = addTaskOverlay.querySelector("#category .dropDown span");
    let inputValid;

    const description = addTaskOverlay.querySelector("#description").value;
    let priority = addTaskOverlay.querySelector(".selectedPrio");
    if (priority == null) { priority = "" }

    if (title != "" && dueDate != "" && category.textContent != "Select task category") {
        inputValid = true;
    } else {
        inputValid = false;
    }
    
    if (!inputValid) {
        console.log("input invalid")
        return;
    } else {
        console.log("input valid, data posted");
        postData("tasks", {
            title: title, 
            description: description,
            dueDate: dueDate,
            priority: priority,
            assignedTo: "",
            category: category,
            subtasks: {"task1": "ticked", "task2": "unticked"},
            stage: targetIndex
        })
    }
    
    // if all fields != ""
    // post to firebase
    
    // clearInputFields();
    // closeOverlay();
    // // fetchData()
    // renderLists();
    // addDragFunction();
}

async function postData(path, data) {
    const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        header: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
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
    prioBtns.forEach(btn => {
        btn.classList.remove("selectedPrio");
    })

    const selected = document.getElementById(id);
    selected.classList.add("selectedPrio");
}