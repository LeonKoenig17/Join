
const titleInput        = document.getElementById("title");
const descriptionInput  = document.getElementById("description");
const dateInput         = document.getElementById("due-date");
const pickerIcon        = document.querySelector(".custom-date-input img");
const priorityButtons   = document.querySelectorAll(".priority-buttons .priority");
const assignedToSelect  = document.getElementById("assignedDropdownSelected");
const categorySelect    = document.getElementById("categorySelect");

// Globale Zustände
let subtasks = [];
let activePriorityButton = null;
// console.log(getAllUsers('login'))