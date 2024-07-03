import mongoose from "mongoose";

export default () => {
  try {
    if (process.env.DB) {
        mongoose.connect(process.env.DB);
        console.log("Connected to database successfully");
      } else {
        console.log("Database URL is not provided in the environment variables");
      }      
  } catch (error) {
    console.error("Could not connect to database:", error);
  }
};
