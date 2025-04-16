function openOverlay(taskData) {
  const overlayContainer = document.getElementById("taskOverlay");
  // Füllen Sie das Overlay mit dem HTML aus boardOverlayTemplate
  overlayContainer.innerHTML = boardOverlayTemplate(taskData);
  // Ändern Sie den Displaywert, damit das Overlay sichtbar wird (hier "flex" für zentrierte Ausrichtung)
  overlayContainer.style.display = "flex";
}
  function closeOverlay() {
    document.getElementById("taskOverlay").classList.add("d-none");
  }
  
  function updateTask(taskIndex) {
    const updatedTitle = document.getElementById("editTitle").value;
    const updatedDescription = document.getElementById("editDescription").value;
    const updatedDueDate = document.getElementById("editDueDate").value;
    const updatedTask = {
      title: updatedTitle,
      description: updatedDescription,
      dueDate: updatedDueDate
    };
    console.log("Updating task", taskIndex, updatedTask);
    closeOverlay();
  }