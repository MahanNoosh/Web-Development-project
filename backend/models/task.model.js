import mongoose from "mongoose";

const taskSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
    },  
    price: {
        type: String,
        required: true,
        default: 0
    },
    creator:{
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Task = mongoose.model("Task", taskSchema);

export default Task;