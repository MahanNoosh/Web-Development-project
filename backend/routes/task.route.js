import express from "express";
import {
  deleteTask,
  updateTask,
  createTask,
  getAllTasks,
  getTask,
  fetchMyTasks,
} from "../controllers/task.controller.js";

const tRouter = express.Router();

tRouter.get("/", getAllTasks);

tRouter.post("/", createTask);

tRouter.put("/:id", updateTask);

tRouter.get("/:id", getTask);

tRouter.get("/loadll/:id", fetchMyTasks);

tRouter.delete("/:id", deleteTask);

export default tRouter;
