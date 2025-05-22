let draggedFromContainer = null;

/**
 * Setzt Drag & Drop und Event-Listener für Buttons.
 */
function setupDragDrop() {
  const containers = document.querySelectorAll("#boardContent .task-list");
  containers.forEach(setupDropZone);

  const addTaskBtn = document.getElementById("addTaskBtn");
  if (addTaskBtn) addTaskBtn.addEventListener("click", () => showAddTaskOverlay("add"));
}


function setupDropZone(container) {
  container.addEventListener("dragover", handleDragOver);
  container.addEventListener("drop", e => handleDrop(e, container));
  setupContainerHighlighting(container);
}


function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
}


function handleDrop(e, container) {
  e.preventDefault();
  container.classList.remove("highlight-container");

  const rawId = e.dataTransfer.getData("text/plain");
  const taskId = rawId.replace("task", "");

  updateStage(container, taskId);

  setTimeout(() => {
    const newTask = document.getElementById(rawId);
    if (newTask) {
      newTask.scrollIntoView({ behavior: "smooth", block: "center" });
      dropHighlight(newTask);
    }
  }, 400);
  draggedFromContainer = null;
}


function setupContainerHighlighting(container) {
  let dragCounter = 0;

  container.addEventListener("dragenter", function () {
    dragCounter++;
    if (container !== draggedFromContainer) {
    container.classList.add("highlight-container");
    }
  });

  container.addEventListener("dragleave", function () {
    dragCounter--;
    if (dragCounter === 0) {
      container.classList.remove("highlight-container");
    }
  }); 
  container.addEventListener("dragend", function () {
    dragCounter = 0;
    container.classList.remove("highlight-container");
  });
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
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
      
      draggedFromContainer = task.closest(".task-list");
    dragAnimation(task);
    });
  }
}

function dragAnimation(task) {
  task.style.transform = "rotate(3deg)";
  task.style.transition = "transform 0.2s";

  task.addEventListener("dragend", function resetRotation() {
    task.style.transform = "rotate(0deg)";
    task.removeEventListener("dragend", resetRotation);
  });
}


function dropHighlight(taskElement) {
  taskElement.classList.add("task-dropped");

  setTimeout(() => {
    taskElement.classList.remove("task-dropped");
  }, 500);
}



// function updateDraggable() {
//     const isSmallScreen = window.matchMedia("(max-width: 800px)").matches;
//     const tasks = document.querySelectorAll(".task");
//     tasks.forEach(task => {
//       task.setAttribute("draggable", !isSmallScreen);
//     })
//   }

// updateDraggable();

// window.addEventListener("resize", updateDraggable);