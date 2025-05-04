async function reloadBoard() {
    const tasks = await loadTasksFromFirebase();
    const boardContainer = document.getElementById("board-container");
    boardContainer.innerHTML = tasks.map((task) => generateTaskCard(task)).join("");
  }