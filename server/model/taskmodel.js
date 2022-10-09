import mongoose from "mongoose";

// const Schema = mongoose.Schema;

let taskSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userModel"
    },
    tasks: [
        {
            taskName: {
                type: String,
                required: true,
            },
            deadline: {
                type: Date,
                required: true,
            },
            isCompleted: {
                type: Boolean,
                default: false,
            },
            reminders: {
                type: [Date],
            },
        }
    ]
});

export default mongoose.model("task", taskSchema, "Tasks");