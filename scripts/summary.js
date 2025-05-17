function init() {
  fillUserLinks();
  loadAndDisplayTaskCounts(); // Tasks laden und anzeigen
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

/**
 * Lädt die Tasks aus Firebase, zählt sie und aktualisiert die Summary.
 */
async function loadAndDisplayTaskCounts() {
  try {
    const tasks = await loadData("tasks");
    const counts = countTasks(tasks);

    document.getElementById("allTasks").textContent = counts.all;
    document.getElementById("toDoTasks").textContent = counts.toDo;
    document.getElementById("inProgressTasks").textContent = counts.inProgress;
    document.getElementById("awaitingFeedbackTasks").textContent =
      counts.awaitFeedback;
    document.getElementById("doneTasks").textContent = counts.done;
    document.getElementById("urgentTasks").textContent = counts.urgent;
  } catch (error) {
    console.error("Fehler beim Laden der Tasks:", error);
  }
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


/** Tageszeit-Begrüßung */
function setGreeting() {
  const currentHour = new Date().getHours();
  let greeting = "Good morning,";

  if (currentHour >= 12 && currentHour < 18) {
    greeting = "Good afternoon,";
  } else if (currentHour >= 18 || currentHour < 5) {
    greeting = "Good evening,";
  }

  const greetingElement = document.getElementById("greeting");
  if (greetingElement) {
    greetingElement.innerText = greeting;
  }
}


function showFullscreenGreeting() {
  const screen = document.getElementById("greetingScreen");

  // Nur für Viewports unter 1000 px
  if (window.innerWidth < 1000 && screen) {
    // 1) Overlay‑Klasse aktivieren
    screen.classList.add("overlay");

    // 2) Nach 2 s ausblenden …
    setTimeout(() => screen.classList.add("fade-out"), 2000);

    // 3) … und nach der Transition komplett entfernen
    screen.addEventListener("transitionend", () => {
      screen.remove();               // nimmt das Element ganz aus dem DOM
    }, { once: true });
  }
}

/* Bei Seiten‑Ladung */
window.addEventListener("DOMContentLoaded", () => {
  setGreeting();
  showFullscreenGreeting();
});
