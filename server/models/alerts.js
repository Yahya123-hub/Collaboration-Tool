import mongoose from "mongoose";

const notificationsSchema = new mongoose.Schema({
  title: String,
  description: String,
  pingTime: Date,
  email: String
  });
  
const noti = mongoose.model('noti', notificationsSchema);

export default noti;
