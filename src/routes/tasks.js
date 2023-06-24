const taskRoutes = require("express").Router();
const taskData = require("../tasks.json");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");
const { taskValidator } = require("../helpers/validator");

taskRoutes.get("/", (req, res) => {
  res.status(200);
  res.send(taskData);
});

taskRoutes.get("/:taskId", (req, res) => {
  let taskList = taskData.Tasks;
  let taskId = req.params.taskId;
  let result = taskList.filter((task) => task.id == taskId);
  res.status(200);
  res.send(result);
});

taskRoutes.post("/", bodyParser.json(), (req, res) => {
  const taskDetail = req.body;
  let writePath = path.join(__dirname, "..", "tasks.json");
  if (taskValidator(taskDetail, taskData).status) {
    let taskDataModified = JSON.parse(JSON.stringify(taskData));
    taskDataModified.Tasks.push(taskDetail);
    fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json(taskValidator(taskDetail, taskData));
  } else {
    res.status(400);
    res.json(taskValidator(taskDetail, taskData));
  }
});

taskRoutes.put("/:taskId", bodyParser.json(), (req, res) => {
  const taskDetail = req.body;
  let taskId = req.params.taskId;
  let writePath = path.join(__dirname, "..", "tasks.json");
  if (taskValidator(taskDetail, taskData, "put", taskId).status) {
    let taskDataModified = JSON.parse(JSON.stringify(taskData));
    for (const task of taskDataModified.Tasks) {
      if (task.id == taskId) {
        task.title = taskDetail?.title || "";
        task.description = taskDetail?.description || "";
        task.isCompleted = taskDetail?.isCompleted;
        break;
      }
    }
    fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {
      encoding: "utf8",
      flag: "w",
    });
    res.status(200);
    res.json(taskValidator(taskDetail, taskData, "put", taskId));
  } else {
    res.status(400);
    res.json(taskValidator(taskDetail, taskData, "put", taskId));
  }
});

taskRoutes.delete("/:taskId", (req, res) => {
  let taskDataModified = JSON.parse(JSON.stringify(taskData));
  let taskId = req.params.taskId;
  let writePath = path.join(__dirname, "..", "tasks.json");

  taskDataModified.Tasks = taskDataModified.Tasks.filter((t) => t.id != taskId);

  fs.writeFileSync(writePath, JSON.stringify(taskDataModified), {
    encoding: "utf8",
    flag: "w",
  });
  res.status(200).send({
    message: `task with Id ${taskId} is deleted successfully`,
    data: taskDataModified,
  });
});

module.exports = taskRoutes;
