import express from "express";
import {deleteTask, updateTask, createTask, getAllTasks } from "../controllers/task.controller.js";

const pRouter = express.Router();

pRouter.get("/", getAllTasks);

pRouter.post("/", createTask);

pRouter.put("/:id", updateTask);

pRouter.delete("/:id", deleteTask);

export default pRouter;
