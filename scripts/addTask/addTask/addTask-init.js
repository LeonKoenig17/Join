function init() {
    fillUserLinks();
    setupDatePicker();
    applyUserColors();
    setupFieldListeners();
    initAssignedDropdown();
  }
  
  function setupDatePicker() {
    const dateInput = document.getElementById("due-date");
    const pickerIcon = document.querySelector(".custom-date-input img");
    if (!dateInput || !pickerIcon) return;
  
    pickerIcon.addEventListener("click", () => {
      if (dateInput.showPicker) dateInput.showPicker();
      else dateInput.focus();
    });

    const today = new Date().toISOString().split("T")[0];
    dateInput.setAttribute("min", today);
  }
  