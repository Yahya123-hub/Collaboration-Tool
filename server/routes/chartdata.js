// routes/tasks.js

import express from "express";
import { Todo } from "../models/tasks.js";

const router = express.Router();

// Get tasks count by month for a specific user
router.get("/tasks-by-month/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const tasksByMonth = await Todo.aggregate([
      { $match: { useremail: email } },  // Filter by email
      { $group: { _id: { $month: "$dueDate" }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(tasksByMonth);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks count by priority for a specific user
router.get("/tasks-by-priority/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const tasksByPriority = await Todo.aggregate([
      { $match: { useremail: email } },  // Filter by email
      { $group: { _id: "$priority", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(tasksByPriority);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks count by category for a specific user
router.get("/tasks-by-category/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const tasksByCategory = await Todo.aggregate([
      { $match: { useremail: email } },  // Filter by email
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(tasksByCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get tasks count by completion status for a specific user
router.get("/tasks-by-completion/:email", async (req, res) => {
  const { email } = req.params;
  try {
    const tasksByCompletion = await Todo.aggregate([
      { $match: { useremail: email } },  // Filter by email
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);
    res.json(tasksByCompletion);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
