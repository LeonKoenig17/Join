function subtasksTemplate(subtask, index) {
  return `
        <div class="subtask-item" data-subtask-index="${index}">
            <p class="subtask-text">• ${subtask.name}</p>
            <div class="subtask-icons">
                <img src="../images/edit-2.svg" alt="Edit" class="subtask-icon edit-subtask" data-index="${index}">
                <div class="vertical-line-subtask-dark"></div>
                <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-subtask" data-index="${index}">
            </div>
        </div>
    `;
}


/**
 * Renders subtasks in the overlay with custom checkbox icons
 */
function taskOverlaySubtaskTemplate(subtask, index) {
  const iconSrc = subtask.completed
    ? '../images/checkboxtrueblack.svg'
    : '../images/checkboxfalseblack.svg';
  const altText = subtask.completed ? 'Completed' : 'Incomplete';

  return `
    <div class="subtask-checkbox-container">
      <img
        src="${iconSrc}"
        alt="${altText}"
        class="subtask-checkbox-icon"
        onclick="toggleSubtaskCompletion(${index})"
      />
      <label for="subtask-${index}" class="subtask-label">${subtask.name}</label>
    </div>
  `;
}