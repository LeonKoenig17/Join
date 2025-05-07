function validateFormElements(elements) {
    const { titleInput, descriptionInput, dateInput, categorySelect, priorityButtons } = elements;
    if (!titleInput || !descriptionInput || !dateInput || !categorySelect || priorityButtons.length === 0) {
      console.error("Ein oder mehrere Formularelemente fehlen.");
      return false;
    }
    return true;
  }
  
  function validateFormData(data) {
    const titleInput = document.getElementById("title");
    const dateInput = document.getElementById("due-date");
    const categorySelect = document.getElementById("categorySelect");
  
    let isValid = true;
  
    if (!data.title) {
      titleInput.classList.add("fieldIsRequired");
      document.getElementById("title-error").textContent = "This field is required";
      isValid = false;
    } else {
      titleInput.classList.remove("fieldIsRequired");
      document.getElementById("title-error").textContent = "";
    }
  
    if (!data.dueDate) {
      dateInput.classList.add("fieldIsRequired");
      document.getElementById("due-date-error").textContent = "This field is required";
      isValid = false;
    } else {
      dateInput.classList.remove("fieldIsRequired");
      document.getElementById("due-date-error").textContent = "";
    }
  
    if (!data.category || data.category === "Select a category") {
      categorySelect.classList.add("fieldIsRequired");
      document.getElementById("category-error").textContent = "This field is required";
      isValid = false;
    } else {
      categorySelect.classList.remove("fieldIsRequired");
      document.getElementById("category-error").textContent = "";
    }
  
    return isValid;
  }
