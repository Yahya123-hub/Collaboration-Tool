import mongoose from 'mongoose';

const collaborationRequestSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  senderEmail: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
    unique: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '7d', // Optional: Automatically delete the document after 7 days
  },
});

const CollaborationRequest = mongoose.model('CollaborationRequest', collaborationRequestSchema);

export default CollaborationRequest;
