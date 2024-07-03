import express from "express";
import { Todo } from "../models/tasks.js";

const router = express.Router();

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const personalTasks = await Todo.find({ organization: "Personal", useremail: email });
    res.json(personalTasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
