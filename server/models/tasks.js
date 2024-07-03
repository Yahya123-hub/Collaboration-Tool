import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
    todo: String,
    isCompleted: Boolean,
    priority: { type: String, default: 'Low' },
    organization: { type: String, default: 'Work' },
    category: { type: String, default: 'Misc' },
    status: { type: String, default: 'Ongoing' },
    dueDate: { type: Date, default: Date.now },
    useremail: String
  });
  
const Todo = mongoose.model('Todo', todoSchema);

export {Todo};
