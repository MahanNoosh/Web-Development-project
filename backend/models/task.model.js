import { u } from "framer-motion/client";
import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["In progress", "Completed", "Not started"],
        default: "Not started",
    },
    creator:{
        type: String,
        required: true
    },
    isPublic: {
        type: Boolean,
        default: false
    },
    description: {
        type: String
    },
    deadline: {
        type: Date
    },
    tag:{
        type: String
    },
    priority: {
        type: Number,
        default: 0
    },
    applause: {
        type: Array,
        items:{
            type: String
        },
        default: ["mahannoosh"] //I applause everyone :)
    },
    duration:{
        type: Number
    },
    startDate: {
        type: Date
    },
    finishDate: {
        type: Date
    },
    image: {
        type: String
    },
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;