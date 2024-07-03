import express from "express";
import { Todo } from "../models/tasks.js";

const router = express.Router();

router.get("/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const tasks = await Todo.find({ organization: "Work", useremail: email });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
