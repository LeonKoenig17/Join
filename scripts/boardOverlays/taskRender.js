function renderAddTaskOverlay() {
    const existing = document.getElementById("taskOverlay");
    if (existing) existing.remove();
    const overlayHTML = addTaskOverlayTemplate();
    document.body.insertAdjacentHTML("beforeend", overlayHTML);
  }
  
  function initializeOverlayFeatures() {
    const taskOverlay = document.getElementById("taskOverlay");
    if (taskOverlay) {
      taskOverlay.style.display = "flex";
      initPriorityButtons();
      initAssignedDropdown();
      initSubtaskUI();
      setupDatePicker();
      setupSubtaskListeners();
      applyUserColors();
      setupFieldListeners();
    }
  }