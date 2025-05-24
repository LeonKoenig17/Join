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

/**
 * Sets focus on the search input field and initializes the task search.
 */
function focusSearchInput() {
  document.getElementById('taskSearch').focus();
  initializeTaskSearch();
}

/**
 * Initializes the task search and adds event listeners.
 * Loads all tasks and renders them based on the search term.
 */
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
   * Renders tasks filtered by a search term onto the board.
   * Clears existing tasks from the board and repopulates it with tasks matching the search criteria.
   * If no search term is provided, all tasks are displayed.
   *
   * @async
   * @param {string} [searchTerm] - The term to filter tasks by.
   *                                If empty or null, all tasks are displayed.
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
   * Checks if a task matches a search term.
   * Compares the term with the task's title, description, due date,
   * category, priority, or assigned users.
   *
   * @param {Object} task - The task object to check.
   * @param {string} term - The search term to compare against the task.
   * @returns {boolean} Returns `true` if the task matches the search term, otherwise `false`.
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
   * Adds placeholders for empty task sections if no tasks are present.
   * These placeholders help keep the section visually appealing and signal to users
   * that no tasks are available.
   */
  function insertNoTaskPlaceholders() {
    if (!toDo.querySelector('.task')) toDo.innerHTML += noTaskHtml;
  if (!inProgress.querySelector('.task')) inProgress.innerHTML += noTaskHtml;
  if (!awaitFeedback.querySelector('.task')) awaitFeedback.innerHTML += noTaskHtml;
  if (!done.querySelector('.task')) done.innerHTML += noTaskHtml;
  }

  
  /**
   * Appends the HTML representation of a task to the specified stage in the DOM.
   *
   * @param {number} stage - The stage to which the task should be added.
   *                         Valid values are:
   *                         0 - "To Do"
   *                         1 - "In Progress"
   *                         2 - "Awaiting Feedback"
   *                         3 - "Done".
   * @param {string} html - The HTML string representing the task to be added.
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
