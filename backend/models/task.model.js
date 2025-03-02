import mongoose from "mongoose";

const taskSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["In progress", "Completed", "Not started", "Overdue"],
      default: "Not started",
    },
    creator: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    description: {
      type: String,
    },
    deadline: {
      type: Date,
    },
    priority: {
      type: String,
      enum: ["High", "Medium", "Low"],
      default: "Medium"
    },
    reaction: {
      type: Array,
      items: {
        type: String,
      },
      default: ["mahannoosh"], //I react to everyone :)
    },
    duration: {
      type: Number,
    },
    startDate: {
      type: Date,
    },
    finishDate: {
      type: Date,
    },
    image: {
      type: String,
    },
    prev:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,

    },
    next:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
