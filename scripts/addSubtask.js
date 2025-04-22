const subtasks = [];

function initSubtaskUI() {
    const subInput = document.getElementById("subtask-input");
    const addIcon = document.getElementById("add-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const seperator = document.getElementById("seperator");

    if (!subInput || !addIcon || !checkIcon || !closeIcon || !seperator) return;

    subInput.value = "";
    toggleIcons(false);
}

function toggleIcons(isActive) {
    const addIcon = document.getElementById("add-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const seperator = document.getElementById("seperator");

    if (!addIcon || !checkIcon || !closeIcon || !seperator) return;

    addIcon.classList.toggle("d-none", isActive);
    checkIcon.classList.toggle("d-none", !isActive);
    closeIcon.classList.toggle("d-none", !isActive);
    seperator.classList.toggle("d-none", !isActive);
}

function activateSubtaskInput() {
    const subInput = document.getElementById("subtask-input");
    if (!subInput) return;

    subInput.value = "Contact Form";
    subInput.style.color = "#000000";
    toggleIcons(true);
    subInput.focus();
}

function cancelSubtaskEntry() {
    initSubtaskUI();
}

function confirmSubtaskEntry() {
    const subInput = document.getElementById("subtask-input");
    if (!subInput) return;

    const val = subInput.value.trim();
    if (val) {
        subtasks.push({ 
            name: val,
            completed: false
        });
        updateSubtaskList();
    }
    initSubtaskUI();
}

function updateSubtaskList() {
    const listContainer = document.getElementById("subtask-list");
    if (!listContainer) return;

    listContainer.innerHTML = subtasks.map((subtask, i) => subtasksTemplate(subtask, i)).join("");
}

function editSubtask(index) {
    const subtaskItems = document.querySelectorAll(".subtask-item");
    if (!subtaskItems[index]) return;

    const subtaskItem = subtaskItems[index];
    const subtaskText = subtaskItem.querySelector(".subtask-text");
    const subtaskIcons = subtaskItem.querySelector(".subtask-icons");

    subtaskItem.classList.add("editing");
    subtaskText.innerHTML = `<input type="text" class="edit-input" value="${subtasks[index].name}" onkeypress="handleEditKeyPress(event, ${index})">`;
    subtaskIcons.innerHTML = `
        <img src="../images/subtaskBin.svg" alt="Delete" class="subtask-icon delete-icon" onclick="deleteSubtask(${index})">
        <img src="../images/checkDark.svg" alt="Save" class="subtask-icon save-icon" onclick="saveSubtask(${index})">
    `;
    subtaskText.querySelector(".edit-input").focus();
}

function saveSubtask(index) {
    const input = document.querySelector(".edit-input");
    if (!input) return;

    const newValue = input.value.trim();
    if (newValue) {
        subtasks[index].name = newValue;
        updateSubtaskList();
    }
}

function handleEditKeyPress(event, index) {
    if (event.key === "Enter") {
        saveSubtask(index);
    }
}

function deleteSubtask(index) {
    subtasks.splice(index, 1);
    updateSubtaskList();
}

function setupSubtaskListeners() {
    const addIcon = document.getElementById("add-icon");
    const closeIcon = document.getElementById("close-subtask-icon");
    const checkIcon = document.getElementById("check-subtask-icon");
    const subInput = document.getElementById("subtask-input");

    if (!addIcon || !closeIcon || !checkIcon || !subInput) return;

    addIcon.addEventListener("click", activateSubtaskInput);
    closeIcon.addEventListener("click", cancelSubtaskEntry);
    checkIcon.addEventListener("click", confirmSubtaskEntry);
    subInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            confirmSubtaskEntry();
        }
    });
}

document.addEventListener("DOMContentLoaded", () => {
    initSubtaskUI();
    setupSubtaskListeners();
});
