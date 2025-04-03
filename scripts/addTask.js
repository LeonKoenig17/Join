const dateInput = document.getElementById('due-date');
document.querySelector('.custom-date-input img').addEventListener('click', () => {
  dateInput.showPicker ? dateInput.showPicker() : dateInput.focus();
});