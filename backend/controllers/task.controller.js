import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const getAllTasks = async (_, res) => {
  try {
    const tasks = await Task.find({});
    const publicTasks = tasks.filter(task => task.isPublic);
    res.status(200).json({ success: true, data: publicTasks });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Error loading task" });
  }
  try {
    const task = await Task.findById(id);
    res.status(200).json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createTask = async (req, res) => {
  const task = req.body;
  if (!task.name) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Please enter all the fields correctly",
      });
  }
  const newTask = new Task(task);
  try {
    await newTask.save();
    res.status(201).json({ success: true, data: newTask });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateTask = async (req, res) => {
  const { id } = req.params;
  const { task, user } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }

  try {
    let updatedTask;
    if (user != null) {
      // If user is provided, update the 'reaction' field specifically
      updatedTask = await Task.findByIdAndUpdate(
        id,
        { $addToSet: { reaction: user } }, // Add user to the 'reaction' array
        { new: true }
      );
    } else {
      // If no user, update the task fields
      updatedTask = await Task.findByIdAndUpdate(id, {...task, next: task.next ? task.next : null, prev: task.prev ? task.prev : null}, { new: true });
    }

    res.status(200).json({ success: true, data: updatedTask });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const deleteTask = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Task not found" });
  }
  try {
    await Task.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const fetchMyTasks = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const taskId = new mongoose.Types.ObjectId(id);

    const tasks = await Task.aggregate([
      { $match: { _id: taskId } },
      {
        $graphLookup: {
          from: 'tasks',
          startWith: '$next',  
          connectFromField: 'next',
          connectToField: '_id',
          as: 'taskChain',
          depthField: 'depth',
        },
      },
      { 
        $project: { 
          allTasks: { $concatArrays: [[ "$$ROOT" ], "$taskChain"] } 
        } 
      },
      { $unwind: "$allTasks" },
      { $sort: { "allTasks.depth": 1 } },
      { $replaceRoot: { newRoot: "$allTasks" } }
    ]);

    return res.status(200).json({ success: true, data: tasks, message: "Tasks fetched successfully" });
  } catch (error) {
    console.error("Error fetching tasks:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message || error,
    });
  }
};

