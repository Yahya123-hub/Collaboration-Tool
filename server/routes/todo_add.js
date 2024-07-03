import express from "express";
import { Todo } from "../models/tasks.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    await Todo.insertMany(req.body.todos);
    res.status(200).send('Todos saved successfully');
  } catch (error) {
    res.status(500).send('Error saving todos: ' + error);
  }
});

export default router;
