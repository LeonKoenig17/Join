async function createTask() {
    const data = getFormData();
    if (!validateFormData(data)) return;
  
    data.taskIndex = Date.now();
    data.stage = 0;
  
    try {
      await postData("tasks", data);
      clearForm();
      window.location.href = "board.html";
    } catch (err) {
      console.error("Fehler:", err);
    }
  }
  