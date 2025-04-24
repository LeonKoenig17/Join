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
    // const addTaskOverlay = document.getElementById("addTaskOverlay");
    // addTaskOverlay.innerHTML = addTaskOverlayTemplate();

    await fetchData();

    const containers = document.querySelectorAll("#boardContent > div");
    containers.forEach(container => {
        container.addEventListener("dragover", (e) => e.preventDefault());
        container.addEventListener("drop", async(e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData("task");
            await updateStage(container, id);
            await fetchData();
        })
    })

    const inputField = document.querySelector("#subtasks input");
    inputField.addEventListener("input", () => {
        if (inputField.value.trim() != "") {
            showSubtaskBtns();
        } else {
            hideSubtaskBtns();
        }
    })

    subtaskHover();
}

async function updateStage(container, taskId) {
    let newStage = null;

    switch (container.id) {
        case "toDo": newStage = 0; break;
        case "inProgress": newStage = 1; break;
        case "awaitFeedback": newStage = 2; break;
        case "done": newStage = 3; break;
        default: break;
    }

    const data = await fetch("https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/tasks.json").then(res => res.json());

    let targetKey = null;
    for (let key in data) {
        if (data[key].taskIndex == taskId) {
            targetKey = key;
            break;
        }
    }

    if (targetKey) {
        const targetURL = `https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/tasks/${targetKey}.json`;
        const task = await fetch(targetURL).then(res => res.json());
        task.stage = newStage;

        const updateRes = await fetch(targetURL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });
        const updated = await updateRes.json();
        console.log(updated);
    }
}

async function fetchData() {
    const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
    const tasks = await fetch(BASE_URL + "/tasks.json").then(res => res.json());
    arrays.forEach(array => array.length = 0);

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
                index: task.taskIndex,
            }
            if (task.stage != null && task.taskIndex != null) {
                arrays[task.stage].push(taskData);
            }
        })

    }
    renderLists();
    addDragFunction();
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
            let subtasks = "";
            if (task.subtasks) {
                task.subtasks.forEach(subtask => {
                    subtasks += `
                        <i>${subtask.title}: </i><i>${subtask.status}</i>
                    `;
                })
            }
            containers[i].innerHTML += `
                <div id="${task.index}" class="task" draggable="true">
                    <table>
                        <tr>
                            <td>Title</td>
                            <td>${task.title}</td>
                        </tr>
                        <tr>
                            <td>Description</td>
                            <td>${task.description}</td>
                        </tr>
                        <tr>
                            <td>DueDate</td>
                            <td>${task.dueDate}</td>
                        </tr>
                        <tr>
                            <td>Priority</td>
                            <td>${task.priority}</td>
                        </tr>
                        <tr>
                            <td>AssignedTo</td>
                            <td>${task.assignedTo}</td>
                        </tr>
                        <tr>
                            <td>Subtasks</td>
                            <td>${subtasks}</td>
                        </tr>
                        <tr>
                            <td>Category</td>
                            <td>${task.category}</td>
                        </tr>
                        <tr>
                            <td>Stage</td>
                            <td>${task.stage}</td>
                        </tr>
                        <tr>
                            <td>Index</td>
                            <td>${task.index}</td>
                        </tr>
                    </table>
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

async function addTask() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    const title = addTaskOverlay.querySelector("#title").value.trim();
    const dueDate = addTaskOverlay.querySelector("#dueDate").value;
    const category = addTaskOverlay.querySelector("#category .dropDown span");
    let inputValid;
    
    const description = addTaskOverlay.querySelector("#description").value;
    let priority = addTaskOverlay.querySelector(".selectedPrio");
    if (priority != null) {
        priority = priority.textContent;
    } else {
        priority = "Medium";
    }
    
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
        await postData("tasks", {
            title: title, 
            description: description,
            dueDate: dueDate,
            priority: priority,
            assignedTo: "",
            category: category.textContent,
            subtasks: getSubtasks(),
            stage: targetIndex,
            taskIndex: new Date().toLocaleTimeString()
        })
    }
    
    clearInputFields();
    closeOverlay();
    fetchData();
}

function getSubtasks() {
    const subConts = document.querySelectorAll("#addedSubContainer .addedSub");
    if (subConts.length == 0) return;

    let subtaskArray = [];
    subConts.forEach(cont => {
        const subtask = cont.querySelector("span").textContent.replace("\u2022 ", "");
        subtaskArray.push({
            title: subtask,
            status: 0
        })
    })
    return subtaskArray;
}

async function postData(path, data) {
    const BASE_URL = "https://join-6e686-default-rtdb.europe-west1.firebasedatabase.app/";
    await fetch(BASE_URL + path + ".json", {
        method: "POST",
        headers: {
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

function clearSubtaskInput() {
    const inputField = document.querySelector("#subtasks input");
    inputField.value = "";
    hideSubtaskBtns();
}

function showSubtaskBtns() {
    const plus = document.getElementById("subtaskPlus");
    const cross = document.getElementById("subtaskCross");
    const check = document.getElementById("subtaskCheck");
    
    plus.style.display = "none";
    cross.style.display = "unset";
    check.style.display = "unset";
}

function hideSubtaskBtns() {
    const plus = document.getElementById("subtaskPlus");
    const cross = document.getElementById("subtaskCross");
    const check = document.getElementById("subtaskCheck");
    
    plus.style.display = "unset";
    cross.style.display = "none";
    check.style.display = "none";
}

function focusInputField() {
    const inputField = document.querySelector("#subtasks input");
    inputField.focus();
}

function subtaskHover(){
    const subtasks = document.querySelectorAll("#addedSubContainer .addedSub");
    subtasks.forEach(task => {
        task.removeEventListener("mouseenter", onMouseEnter);
        task.removeEventListener("mouseleave", onMouseLeave);
        task.addEventListener("mouseenter", onMouseEnter);
        task.addEventListener("mouseleave", onMouseLeave);
    });
}

function onMouseEnter(e) {
    const buttons = e.currentTarget.querySelectorAll("#addedSubBtns button");
    buttons.forEach(btn => {
        btn.style.visibility = "visible";
    });
}

function onMouseLeave(e) {
    const buttons = e.currentTarget.querySelectorAll("#addedSubBtns button");
    buttons.forEach(btn => {
        btn.style.visibility = "hidden";
    })
}

function enableEditMode(parent) {
    const inputField = parent.querySelector("input");
    inputField.style.display = "block";
    inputField.focus();
    const span = parent.querySelector("span");
    inputField.value = span.textContent.replace("\u2022 ", "");
    span.style.display = "none";
    const editBtn = parent.querySelector("#addedSubEdit");
    editBtn.style.display = "none";
    const confirmBtn = parent.querySelector("#addedSubConfirm")
    confirmBtn.style.display = "unset";
    parent.removeEventListener("mouseenter", onMouseEnter);
    parent.removeEventListener("mouseleave", onMouseLeave);
    parent.style.borderBottom = "1px solid #29ABE2";
    parent.style.borderRadius = "0";
    parent.style.backgroundColor = "unset";
}

function disableEditMode(parent) {
    const span = parent.querySelector("span");
    const inputField = parent.querySelector("input");
    if (inputField.value.trim() == "") {
        parent.remove();
        return;
    }
    span.style.display = "block";
    span.textContent = "\u2022 " + inputField.value;
    inputField.value = "";
    inputField.style.display = "none";
    const editBtn = parent.querySelector("#addedSubEdit");
    editBtn.style.display = "unset";
    const confirmBtn = parent.querySelector("#addedSubConfirm")
    confirmBtn.style.display = "none";
    parent.addEventListener("mouseenter", onMouseEnter);
    parent.addEventListener("mouseleave", onMouseLeave);
    parent.style.borderBottom = "none";
    parent.style.borderRadius = "10px";
    parent.style.backgroundColor = "";
}

function deleteElement(element) {
    element.remove();
}

function addSubtask() {
    const inputField = document.querySelector("#subtasks input");
    const subtaskContainer = document.getElementById("addedSubContainer");
    subtaskContainer.innerHTML += addedSubContainerTemplate(inputField.value);
    clearSubtaskInput();
}

// due Date:
    // add calender button
    // restrict inputField.value to date format
// finish priority button style
// fetch users to display in assignedTo dropdown menu
// when editing subtask, if inputField is empty delete subtask
// close button style
// cancel and addtask button style
// finish layout when opening dropdown menu
// warning when required fields are not filled

// create taskCard in board

// create taskOverlay

// implement search function and addTask function on button