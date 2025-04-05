let toDoArray = [{title: "Chicken",index: 1}];
let inProgressArray = [{title: "Human",index: 2}];
let awaitFeedbackArray = [];
let doneArray = [];

const arrays = [toDoArray, inProgressArray, awaitFeedbackArray, doneArray];
const noTaskHtml = `
    <div class="noTasks">
        <span>No tasks To do</span>
    </div>
`;

window.onload = () => {
    renderLists();
    addDragFunction();

    const containers = document.querySelectorAll("#boardContent > div");

    containers.forEach(container => {
        container.addEventListener("dragover", (e) => e.preventDefault());
    
        container.addEventListener("drop", (e) => {
            e.preventDefault();

            const id = e.dataTransfer.getData("task");
            const taskId = parseInt(id.replace("task", ""));

            let originArray = null;
            let task = null;

            for (const [name, arr] of Object.entries(arrays)) {
                const index = arr.findIndex(t => t.index === taskId);
                if (index !== -1) {
                    task = arr.splice(index, 1)[0]; // remove the task from original array
                    console.log(task);
                    originArray = name;
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

    // console.log(taskArray);
    // get containerId object and render in container
    // change location to current container id
    // if container is empty, display "noTasks"
}

function addTask(index) {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    addTaskOverlay.style.display = "flex";

    const containers = document.querySelectorAll("#boardContent > div");
    
    addTaskOverlay.querySelector("button").addEventListener("click", () => {
        const title = addTaskOverlay.querySelector("input").value.trim();
        const taskIndex = arrays.reduce((sum, arr) => sum + arr.length, 0) + 1;

        arrays[index].push({
            title: title,
            index: taskIndex
        })

        renderLists();
        addDragFunction();
        
        closeAddTaskOverlay();
    });

}

function closeAddTaskOverlay() {
    const addTaskOverlay = document.getElementById("addTaskOverlay");
    addTaskOverlay.style.display = "none";
}