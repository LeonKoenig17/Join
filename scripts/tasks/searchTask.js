let allTasksSearch = {};

const searchInput = document.getElementById("taskSearch");

const boardMain = document.getElementById("mainContent");
const boardContent = document.getElementById("boardContent");

const toDo = document.getElementById("toDo");
const inProgress = document.getElementById("inProgress");
const awaitFeedback = document.getElementById("awaitFeedback");
const done = document.getElementById("done");


const noTaskHtml = `
  <div class="noTasks">
    <span>No tasks To do</span>
  </div>
`;

async function initializeTaskSearch() {
  if (!searchInput) return;

  allTasksSearch = await loadData("tasks");
  renderFilteredTasks();

  searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim().toLowerCase();
  if (query.length === 0) {
    renderFilteredTasks();
  } else if (query.length >= 3) {
    renderFilteredTasks(query);
  }
});

  /**
   * Rendert Aufgaben, die nach einem Suchbegriff gefiltert wurden, auf das Board.
   * Löscht vorhandene Aufgaben vom Board und füllt es mit Aufgaben, die den Suchkriterien entsprechen, neu.
   * Wenn kein Suchbegriff angegeben ist, werden alle Aufgaben angezeigt.
   *
   * @async
   * @function
   * @param {string} searchTerm - Der Begriff, nach dem die Aufgaben gefiltert werden.
   *                              Wenn leer oder null, werden alle Aufgaben angezeigt.
   * @returns {Promise<void>} Löst sich auf, wenn die Aufgaben gerendert und benutzerspezifische Farben angewendet wurden.
   */
  async function renderFilteredTasks(searchTerm) {
    if (!boardMain || !boardContent) return;

    toDo.innerHTML = "";
    inProgress.innerHTML = "";
    awaitFeedback.innerHTML = "";
    done.innerHTML = "";

    renderColumnBtns([toDo, inProgress, awaitFeedback, done]);

    for (let id in allTasksSearch) {
      const task = allTasksSearch[id];
      if (!task) continue;

      if (!searchTerm || taskMatchesSearch(task, searchTerm)) {
        const html = generateTaskCard({ ...task, id });
        appendTaskToStage(task.stage, html);
      }
    }
    insertNoTaskPlaceholders();
    await applyUserColors();
  }

  /**
   * Überprüft, ob eine Aufgabe mit einem Suchbegriff übereinstimmt, indem der Begriff
   * mit dem Titel, der Beschreibung, dem Fälligkeitsdatum, der Kategorie oder den zugewiesenen Benutzern der Aufgabe verglichen wird.
   *
   * @param {Object} task - Das Aufgabenobjekt, das überprüft werden soll.
   * @param {string} term - Der Suchbegriff, mit dem die Aufgabe verglichen wird.
   * @returns {boolean} - Gibt `true` zurück, wenn die Aufgabe mit dem Suchbegriff übereinstimmt, andernfalls `false`.
   */
  function taskMatchesSearch(task, term) {
    const title = task.title?.toLowerCase() || "";
    const description = task.description?.toLowerCase() || "";
    const dueDate = task.dueDate?.toLowerCase() || "";
    const category = task.category?.toLowerCase() || "";
    const priority = task.priority?.toLowerCase() || "";
    const assigned = Array.isArray(task.assignedTo)
      ? task.assignedTo.some((user) => user.name?.toLowerCase().includes(term))
      : false;

    return (
      title.includes(term) ||
      description.includes(term) ||
      dueDate.includes(term) ||
      category.includes(term) ||
      priority.includes(term) ||
      assigned
    );
  }

  /**
   * Fügt Platzhalter für leere Aufgabenbereiche hinzu, wenn keine Aufgaben vorhanden sind.
   * Diese Platzhalter helfen dabei, den Bereich visuell ansprechend zu halten und den Benutzern zu signalisieren,
   */
  function insertNoTaskPlaceholders() {
    if (!toDo.querySelector('.task')) toDo.innerHTML += noTaskHtml;
  if (!inProgress.querySelector('.task')) inProgress.innerHTML += noTaskHtml;
  if (!awaitFeedback.querySelector('.task')) awaitFeedback.innerHTML += noTaskHtml;
  if (!done.querySelector('.task')) done.innerHTML += noTaskHtml;
  }

  
  /**
   * Fügt die HTML-Darstellung einer Aufgabe der angegebenen Phase im DOM hinzu.
   *
   * @param {number} stage - Die Phase, zu der die Aufgabe hinzugefügt werden soll.
   *                         Gültige Werte sind:
   *                         0 - "To Do"
   *                         1 - "In Bearbeitung"
   *                         2 - "Feedback ausstehend"
   *                         3 - "Erledigt"
   * @param {string} html - Der HTML-String, der die hinzuzufügende Aufgabe repräsentiert.
   */
  function appendTaskToStage(stage, html) {
    switch (stage) {
      case 0:
        document.getElementById("toDo").innerHTML += html;
        break;
      case 1:
        document.getElementById("inProgress").innerHTML += html;
        break;
      case 2:
        document.getElementById("awaitFeedback").innerHTML += html;
        break;
      case 3:
        document.getElementById("done").innerHTML += html;
        break;
      default:
        break;
    }
  }
}
