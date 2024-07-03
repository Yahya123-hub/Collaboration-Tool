import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  task: { type: String, required: true },
  assignTo: { type: String, required: true }, // email of the user
  assignedBy: { type: String, required: true }, // email of the user
  percentComplete: { type: Number, default: 0 },
  isDone: { type: Boolean, default: false },
  isAssigned: { type: Boolean, default: false }
});

const Assignment = mongoose.model('Assignment', taskSchema);

export default Assignment;
