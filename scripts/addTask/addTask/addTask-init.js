function init() {
    fillUserLinks();
    setupDatePicker();
    applyUserColors();
    setupFieldListeners();
    fillDescription();
  }
  
  function setupDatePicker() {
    const dateInput = document.getElementById("due-date");
    const pickerIcon = document.querySelector(".custom-date-input img");
    if (!dateInput || !pickerIcon) return;
  
    pickerIcon.addEventListener("click", () => {
      if (dateInput.showPicker) dateInput.showPicker();
      else dateInput.focus();
    });
  }
  