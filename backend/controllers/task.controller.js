import Task from "../models/task.model.js";
import mongoose from "mongoose";

export const getAllTasks = async (_, res) => {
    try {
        const tasks = await Task.find({});
        res.status(200).json({success: true, data: tasks})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const createTask = async (req, res)=>{
    const task = req.body;
    if (!task.name) {
        return res.status(400).json({success: false, message: "Please enter all the fields correctly"})
    }
    const newTask = new Task(task)
    try {
        await newTask.save();
        res.status(201).json({success: true, data: newTask})
    } catch (error) {
        res.status(500).json({success: false, "message": error.message})
    }
}

export const updateTask = async (req, res)=>{
    const {id} = req.params;
    const task = req.body;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Task not found"})
    }
    try {
        const updatedTask = await Task.findByIdAndUpdate(id, task, {new: true});
        res.status(200).json({success: true, data: updatedTask})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}

export const deleteTask = async (req, res)=>{
    const {id} = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Task not found"})
    }
    try {
        await Task.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "Task deleted successfully"})
    } catch (error) {
        res.status(500).json({success: false, "message": "Server error"})
    }
}