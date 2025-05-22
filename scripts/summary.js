async function init() {
  fillUserLinks();
  await loadAndDisplayTaskCounts();
  addHelpToPopup();
}

init(); // Startpunkt

async function loadAndDisplayTaskCounts() {
  try {
    const tasks = await loadData("tasks");
    const counts = countTasks(tasks);

    document.getElementById("allTasks").textContent = counts.all;
    document.getElementById("toDoTasks").textContent = counts.toDo;
    document.getElementById("inProgressTasks").textContent = counts.inProgress;
    document.getElementById("awaitingFeedbackTasks").textContent = counts.awaitFeedback;
    document.getElementById("doneTasks").textContent = counts.done;
    document.getElementById("urgentTasks").textContent = counts.urgent;
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }

  bodyVisible();
}

// Wenn Firebase fertig ist (z. B. nach Auth)
function bodyVisible() {
  document.body.style.visibility = "visible";
}


/**
 * Mappt die `stage`-Nummern auf die entsprechenden Kategorien.
 * @param {number} stage - Die Stage-Nummer des Tasks.
 * @returns {string} - Die Beschreibung der Stage.
 */
function getStageDescription(stage) {
  switch (stage) {
    case 0:
      return "To Do";
    case 1:
      return "In Progress";
    case 2:
      return "Awaiting Feedback";
    case 3:
      return "Done";
    default:
      return "Unknown";
  }
}

/**
 * Zählt Tasks pro Stage.
 * @param {Object} tasksObj – das zurückgegebene Objekt von loadData('tasks')
 * @returns {{all: number, toDo: number, inProgress: number, awaitFeedback: number, done: number, urgent: number}}
 */
function countTasks(tasksObj) {
  const counts = {
    all: 0,
    toDo: 0,
    inProgress: 0,
    awaitFeedback: 0,
    done: 0,
    urgent: 0,
  };

  if (!tasksObj) return counts;
  Object.values(tasksObj).forEach((task) => {
    counts.all++;
    switch (task.stage) {
      case 0:
        counts.toDo++;
        break;
      case 1:
        counts.inProgress++;
        break;
      case 2:
        counts.awaitFeedback++;
        break;
      case 3:
        counts.done++;
        break;
    }
    if (task.priority && task.priority.toLowerCase() === "urgent") {
      counts.urgent++;
    }
  });

  return counts;
}


document.addEventListener("DOMContentLoaded", function () {
  setCurrentDate();
  setGreeting();
});


/** Zeigt das aktuelle Datum an. */
function setCurrentDate() {
  const currentDate = new Date();
  const options = { month: 'long', day: 'numeric', year: 'numeric' };
  const formattedDate = currentDate.toLocaleDateString('de-DE', options);

  const dateElement = document.getElementById("current-date");
  if (dateElement) {
    dateElement.innerText = formattedDate;
  }
}


function setGreeting(userName) {
  const h = new Date().getHours();
  let greeting =
    h >= 18 || h < 5 ? "Good evening" :
      h >= 12 ? "Good afternoon" :
        "Good morning";

  const punctuation = (userName === "Guest") ? "!" : ",";
  document.getElementById("greeting").textContent = greeting + punctuation;
}

/** Zeigt den Namen des Benutzers an. */
/** Overlay bei schmalen Screens ----------------------------- */
window.addEventListener("load", () => {
  setGreeting();                       // Text setzen

  const box = document.getElementById("greetingScreen");
  if (box && window.innerWidth <= 1000) {
    box.classList.add("fullscreen");   // Overlay anzeigen
    setTimeout(() => {
      box.classList.remove("fullscreen"); // nach 2 s wieder weg
      // Media‑Query macht den Rest (display:none)
    }, 2000);
  }
});


function setGreeting() {
  const name = localStorage.getItem("name"); // Benutzername aus localStorage holen

  const h = new Date().getHours();
  let greeting =
    h >= 18 || h < 5 ? "Good evening" :
      h >= 12 ? "Good afternoon" :
        "Good morning";

  const punctuation = (name === "sofiam@gmail.com") ? "!" : ",";
  document.getElementById("greeting").textContent = greeting + punctuation;
}