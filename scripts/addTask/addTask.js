const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const dateInput = document.getElementById("due-date");
const pickerIcon = document.querySelector(".custom-date-input img");
const priorityButtons = document.querySelectorAll(
  ".priority-buttons .priority"
);
const assignedToSelect = document.getElementById("assignedDropdownSelected");
const categorySelect = document.getElementById("categorySelect");

let activePriorityButton = null;

/**
 * Initialisiert die Anwendung, indem notwendige Komponenten und Event-Listener eingerichtet werden.
 * - Konfiguriert den Date-Picker für die Aufgabenplanung.
 * - Wendet benutzerspezifische Farbthemen an.
 * - Richtet Event-Listener für Eingabefelder ein.
 * - Füllt das Beschreibungsfeld mit Standard- oder vorab geladenem Inhalt.
 */
function init() {
  setupDatePicker();
  applyUserColors();
  setupFieldListeners();
  fillDescription();
}

function setupDatePicker() {
  const dateInput = document.getElementById("due-date");
  const pickerIcon = document.querySelector(".custom-date-input img");

  if (!dateInput || !pickerIcon) {
    console.error("Date input or picker icon not found");
    return;
  }

  pickerIcon.addEventListener("click", function () {
    if (dateInput.showPicker) {
      dateInput.showPicker();
    } else {
      dateInput.focus();
    }
  });
}

async function createTask() {
  const data = getFormData();
  if (!validateFormData(data)) {
    return;
  }

  data.taskIndex = Date.now();
  data.stage = 0;

  try {
    await postData("tasks", data);
    clearForm();
    window.location.href = "board.html";
  } catch (err) {
    console.error("Fehler:", err);
  }
}

/**
 * Sammelt und validiert Formulardaten und erstellt ein Objekt mit den Aufgabendetails.
 *
 * @returns {Object|null} Ein Objekt mit den Aufgabendetails, wenn das Formular gültig ist, oder `null`, wenn die Validierung fehlschlägt.
 * @property {string} title - Der Titel der Aufgabe.
 * @property {string} description - Eine detaillierte Beschreibung der Aufgabe.
 * @property {string} dueDate - Das Fälligkeitsdatum der Aufgabe im String-Format.
 * @property {string} priority - Die Prioritätsstufe der Aufgabe (z. B. "Hoch", "Mittel", "Niedrig").
 * @property {Array<string>} assignedTo - Ein Array von Kontakten, die der Aufgabe zugewiesen sind.
 * @property {string} category - Die Kategorie der Aufgabe.
 * @property {Array<Object>} subtasks - Ein Array von Unteraufgaben, die jeweils als Objekt dargestellt werden.
 */
function getFormData() {
  const formElements = getFormElements();
  if (!validateFormElements(formElements)) return null;

  const { title, description, dueDate, category } = getFormValues(formElements);
  const priority = getActivePriority();
  const assignedTo = getAssignedContacts();
  const subtasksData = getSubtasksData();

  return {
    title,
    description,
    dueDate,
    priority,
    assignedTo,
    category,
    subtasks: subtasksData,
  };
}


/**
 * Extrahiert und validiert Formularwerte aus dem bereitgestellten Elemente-Objekt.
 *
 * @param {Object} elements - Ein Objekt, das die Formulareingabeelemente enthält.
 * @param {HTMLInputElement} elements.titleInput - Das Eingabefeld für den Aufgabentitel.
 * @param {HTMLInputElement} elements.descriptionInput - Das Eingabefeld für die Aufgabenbeschreibung.
 * @param {HTMLInputElement} elements.dateInput - Das Eingabefeld für das Fälligkeitsdatum der Aufgabe.
 * @param {HTMLSelectElement} elements.categorySelect - Das Auswahlfeld für die Aufgaben-Kategorie.
 * @returns {Object|null} Ein Objekt mit den extrahierten Formularwerten 
 *                        ({ title, description, dueDate, category }), falls gültig, 
 *                        oder `null`, wenn die Kategorie ungültig ist.
 */
function getFormValues(elements) {
  const { titleInput, descriptionInput, dateInput, categorySelect } = elements;

  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const dueDate = dateInput.value.trim();
  const category = categorySelect.value;

  if (!category || category === "Select task category") {
    console.error("Die Kategorie muss ausgewählt werden.");
    return null;
  }

  return { title, description, dueDate, category };
}

/**
 * Ruft Formularelemente aus dem DOM für die Aufgabenerstellung ab.
 * 
 * @returns {Object} Ein Objekt, das Referenzen zu den folgenden Formularelementen enthält:
 * - `titleInput` {HTMLInputElement}: Das Eingabefeld für den Aufgabentitel.
 * - `descriptionInput` {HTMLInputElement}: Das Eingabefeld für die Aufgabenbeschreibung.
 * - `dateInput` {HTMLInputElement}: Das Eingabefeld für das Fälligkeitsdatum der Aufgabe.
 * - `categorySelect` {HTMLSelectElement}: Das Dropdown-Menü zur Auswahl einer Aufgaben-Kategorie.
 * - `priorityButtons` {NodeListOf<Element>}: Eine Sammlung von Schaltflächen für die Priorität.
 */
function getFormElements() {
  return {
    titleInput: document.getElementById("title"),
    descriptionInput: document.getElementById("description"),
    dateInput: document.getElementById("due-date"),
    categorySelect: document.getElementById("categorySelect"),
    priorityButtons: document.querySelectorAll(".priority-buttons .priority"),
  };
}

/**
 * Überprüft die Anwesenheit der erforderlichen Formularelemente.
 *
 * @param {Object} elements - Ein Objekt, das die zu überprüfenden Formularelemente enthält.
 * @param {HTMLInputElement} elements.titleInput - Das Eingabefeld für den Aufgabentitel.
 * @param {HTMLInputElement} elements.descriptionInput - Das Eingabefeld für die Aufgabenbeschreibung.
 * @param {HTMLInputElement} elements.dateInput - Das Eingabefeld für das Fälligkeitsdatum der Aufgabe.
 * @param {HTMLSelectElement} elements.categorySelect - Das Auswahlfeld für die Aufgaben-Kategorie.
 * @param {HTMLInputElement[]} elements.priorityButtons - Ein Array von Eingabeelementen, die die Prioritätsschaltflächen darstellen.
 * @returns {boolean} Gibt `true` zurück, wenn alle erforderlichen Elemente vorhanden sind, andernfalls `false`.
 */
function validateFormElements(elements) {
  const { titleInput, descriptionInput, dateInput, categorySelect, priorityButtons } = elements;

  if (!titleInput || !descriptionInput || !dateInput || !categorySelect || priorityButtons.length === 0) {
    console.error("Ein oder mehrere Formularelemente fehlen.");
    return false;
  }
  return true;
}

/**
 * Ruft den Textinhalt der aktuell aktiven Prioritätsschaltfläche ab.
 *
 * Diese Funktion wählt alle Elemente mit der Klasse "priority" innerhalb des Containers 
 * mit der Klasse "priority-buttons" aus. Sie überprüft jede Schaltfläche, ob sie die 
 * Klasse "active-btn" besitzt, und gibt in diesem Fall ihren getrimmten Textinhalt zurück. 
 * Wenn keine Schaltfläche aktiv ist, wird ein leerer String zurückgegeben.
 *
 * @returns {string} Der Textinhalt der aktiven Prioritätsschaltfläche oder ein leerer String, wenn keine aktiv ist.
 */
function getActivePriority() {
  const priorityButtons = document.querySelectorAll(".priority-buttons .priority");
  for (let i = 0; i < priorityButtons.length; i++) {
    if (priorityButtons[i].classList.contains("active-btn")) {
      return priorityButtons[i].textContent.trim();
    }
  }
  return "";
}

/**
 * Ruft ein Array von Unteraufgaben mit ihren Namen und einem standardmäßigen Abschlussstatus ab.
 *
 * @returns {Array<Object>} Ein Array von Objekten, die Unteraufgaben darstellen, 
 * jeweils mit:
 *   - `name` {string}: Der Name der Unteraufgabe.
 *   - `completed` {boolean}: Der Abschlussstatus der Unteraufgabe, standardmäßig `false`.
 */
function getSubtasksData() {
  return subtasks.map((subtask) => ({
    name: subtask.name,
    completed: false,
  }));
}

/**
 * Ruft ein Array von Unteraufgaben mit ihren Namen und einem standardmäßigen Abschlussstatus ab.
 *
 * @returns {Array<Object>} Ein Array von Objekten, die Unteraufgaben darstellen, 
 * jeweils mit:
 *   - `name` {string}: Der Name der Unteraufgabe.
 *   - `completed` {boolean}: Der Abschlussstatus der Unteraufgabe, standardmäßig `false`.
 */
function getSubtasksData() {
  return subtasks.map((subtask) => ({
    name: subtask.name,
    completed: false,
  }));
}

/** validateFormData(data) Muss noch runtergebrochen werden */


function validateFormData(data) {
  const titleInput = document.getElementById("title");
  const descriptionInput = document.getElementById("description");
  const dateInput = document.getElementById("due-date");
  const categorySelect = document.getElementById("categorySelect");

  if (!titleInput || !descriptionInput || !dateInput || !categorySelect) {
    return false;
  }

  let isValid = true;

  if (!data.title) {
    titleInput.classList.add("fieldIsRequired");
    document.getElementById("title-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    titleInput.classList.remove("fieldIsRequired");
    document.getElementById("title-error").textContent = "";
  }

  if (!data.description) {
    descriptionInput.classList.add("fieldIsRequired");
    document.getElementById("description-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    descriptionInput.classList.remove("fieldIsRequired");
    document.getElementById("description-error").textContent = "";
  }

  if (!data.dueDate) {
    dateInput.classList.add("fieldIsRequired");
    document.getElementById("due-date-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    dateInput.classList.remove("fieldIsRequired");
    document.getElementById("due-date-error").textContent = "";
  }

  if (!data.category || data.category === "Select task category") {
    categorySelect.classList.add("fieldIsRequired");
    document.getElementById("category-error").textContent =
      "This field is required";
    isValid = false;
  } else {
    categorySelect.classList.remove("fieldIsRequired");
    document.getElementById("category-error").textContent = "";
  }

  return isValid;
}

function setupFieldListeners() {
  const fields = [titleInput, dateInput, categorySelect];

  fields.forEach((field) => {
    let fieldClicked = false;

    field.addEventListener("focus", () => {
      fieldClicked = true;
    });

    field.addEventListener("blur", () => {
      if (
        (field === categorySelect && field.value === "Select task category") ||
        field.value.trim() === ""
      ) {
        field.classList.add("fieldIsRequired");
      } else {
        field.classList.remove("fieldIsRequired");
        field.nextElementSibling.textContent = "";
      }
    });

    field.addEventListener("focus", () => {
      if (fieldClicked) {
        field.classList.remove("fieldIsRequired");
      }
    });
  });
}

function fillDescription() {
  descriptionInput.addEventListener("click", () => {
    descriptionInput.value = "Create a contact form and imprint page.";
  });
}

function clearForm() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  dateInput.value = "";

  for (let i = 0; i < priorityButtons.length; i++) {
    priorityButtons[i].classList.remove("active-btn");
  }

  if (assignedToSelect) {
    assignedToSelect.selectedIndex = -1;
  }
  if (categorySelect) {
    categorySelect.selectedIndex = 0;
  }

  clearFieldErrors();
  updateSubtaskList();
}

function clearFieldErrors() {
  document.getElementById("title-error").textContent = "";
  document.getElementById("description-error").textContent = "";
  document.getElementById("due-date-error").textContent = "";
  document.getElementById("category-error").textContent = "";

  const inputFields = [titleInput, descriptionInput, dateInput, categorySelect];
  inputFields.forEach((field) => {
    field.classList.remove("fieldIsRequired");
  });
}

function setPriority(button) {
  activePriorityButton = button;
  priorityButtons.forEach(btn => btn.classList.remove('active-btn'));
  button.classList.add('active-btn');
}

document.addEventListener('click', function(e) {
  if (!e.target.closest('.priority-buttons')) {
    if (activePriorityButton) {
      priorityButtons.forEach(btn => btn.classList.remove('active-btn'));
      activePriorityButton.classList.add('active-btn');
    }
  }
});

