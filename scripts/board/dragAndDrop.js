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

// updateStage(container, taskId);


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
  if (!isMobile()) {
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
  } else {
    addMobileDragFunction();
  }
}

function addMobileDragFunction() {
  const tasks = document.querySelectorAll(".task");
  tasks.forEach(task => {
    task.addEventListener("touchstart", function (e) {
      // mobileActions.style.display = "none";
      pressTimer = setTimeout(() => {
        const mobileActions = document.getElementById("mobileTaskActions");
        if (mobileActions) mobileActions.remove();
        doSomethingOnLongPress(task);
      }, 600);
    }, { passive: true });

    task.addEventListener("touchend", function (e) {
      clearTimeout(pressTimer);
    });

    task.addEventListener("touchmove", function (e) {
      clearTimeout(pressTimer);
    });
  });
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

function doSomethingOnLongPress(task) {
  task.innerHTML += mobileActionsTemplate();
  // mobileActions.style.display = "flex";
  const savedOnclick = task.onclick;
  task.onclick = null;
  
  document.addEventListener("click", function (e) {
    const mobileActions = document.getElementById("mobileTaskActions");
    if (!mobileActions.contains(e.target)) {
      mobileActions.remove();
      task.onclick = savedOnclick;
    }
  })
}

function processMobileInput(containerId) {
  const container = document.getElementById(containerId);
  const mobileActions = document.getElementById("mobileTaskActions");
  const taskId = mobileActions.parentElement.id.replace("task", "");
  updateStage(container, taskId);
}