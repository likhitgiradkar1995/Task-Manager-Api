const taskValidator = (taskInfo, taskData, method, taskId) => {
  if (
    taskInfo.hasOwnProperty("title") &&
    taskInfo.hasOwnProperty("description") &&
    taskInfo.hasOwnProperty("isCompleted")
  ) {
    let sameIdFound = taskData.Tasks.some(
      (el) => el.id == (taskInfo.id || taskId)
    );
    if (sameIdFound) {
      if (method == "put") {
        return { status: true, message: "task updated successfully!" };
      } else {
        return {
          status: false,
          message: "task id has to be unique",
        };
      }
    } else {
      if (method == "put") {
        return {
          status: false,
          message: " task with given id is not found !",
        };
      } else {
        return {
          status: true,
          message: "Course has been added",
        };
      }
    }
  } else {
    return {
      status: false,
      message: "Course Info is malformed please provide all the properties",
    };
  }
};

module.exports = { taskValidator: taskValidator };
