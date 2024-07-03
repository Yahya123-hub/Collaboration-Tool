import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  priority: String,
  deadline: Number,
  tags: [
    {
      title: String,
      bg: String,
      text: String,
    },
  ],
  image: String,
  alt: String,
  usermail: String
});

const BacklogTask = mongoose.model('BacklogTask', taskSchema);
const PendingTask = mongoose.model('PendingTask', taskSchema);
const TodoTask = mongoose.model('TodoTask', taskSchema);
const DoingTask = mongoose.model('DoingTask', taskSchema);
const DoneTask = mongoose.model('DoneTask', taskSchema);

export {BacklogTask, PendingTask, TodoTask, DoingTask, DoneTask };
