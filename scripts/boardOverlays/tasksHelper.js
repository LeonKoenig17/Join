function checkUserColor(taskData, users) {
    if (!Array.isArray(taskData.assignedTo)) return;
    for (let i = 0; i < taskData.assignedTo.length; i++) {
      const ass = taskData.assignedTo[i];
      for (let j = 0; j < users.length; j++) {
        if (users[j].id === ass.id) {
          ass.color = users[j].color;
          break;
        }
      }
    }
  }