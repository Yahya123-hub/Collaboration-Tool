import mongoose from 'mongoose';

const groupSchema = new mongoose.Schema({
  members: [String],
  createdAt: { type: Date, default: Date.now },
});

const Group = mongoose.model('Group', groupSchema);

export default Group;
