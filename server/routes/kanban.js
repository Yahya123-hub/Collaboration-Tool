import express from "express";
import { BacklogTask, PendingTask, TodoTask, DoingTask, DoneTask } from "../models/kanban_tasks.js";

const router = express.Router();

router.post('/save-tasks', async (req, res) => {
  try {
    const { backlogTasks, pendingTasks, todoTasks, doingTasks, doneTasks, usermail } = req.body;

    await Promise.all([
      BacklogTask.deleteMany({usermail}),
      PendingTask.deleteMany({usermail}),
      TodoTask.deleteMany({usermail}),
      DoingTask.deleteMany({usermail}),
      DoneTask.deleteMany({usermail})
    ]);
    
    // Append userEmail to each task
    const backlogTasksWithEmail = backlogTasks.map(task => ({ ...task, usermail }));
    const pendingTasksWithEmail = pendingTasks.map(task => ({ ...task, usermail }));
    const todoTasksWithEmail = todoTasks.map(task => ({ ...task, usermail }));
    const doingTasksWithEmail = doingTasks.map(task => ({ ...task, usermail }));
    const doneTasksWithEmail = doneTasks.map(task => ({ ...task, usermail }));
    
    // Save new tasks
    await Promise.all([
      BacklogTask.insertMany(backlogTasksWithEmail),
      PendingTask.insertMany(pendingTasksWithEmail),
      TodoTask.insertMany(todoTasksWithEmail),
      DoingTask.insertMany(doingTasksWithEmail),
      DoneTask.insertMany(doneTasksWithEmail)
    ]);

    res.status(200).send('Tasks saved successfully');
  } catch (error) {
    res.status(500).send('Error saving tasks');
  }
});

router.get('/fetch-tasks/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const backlogTasks = await BacklogTask.find({ usermail: email });
    const pendingTasks = await PendingTask.find({ usermail: email });
    const todoTasks = await TodoTask.find({ usermail: email });
    const doingTasks = await DoingTask.find({ usermail: email });
    const doneTasks = await DoneTask.find({ usermail: email });

    res.status(200).json({ backlogTasks, pendingTasks, todoTasks, doingTasks, doneTasks });
  } catch (error) {
    res.status(500).send('Error fetching tasks');
  }
});

export default router;
