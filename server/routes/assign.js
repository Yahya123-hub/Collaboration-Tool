import express from "express";
import Assignment from "../models/collab_tasks.js";

const router = express.Router();

router.post('/', async (req, res) => {
  const assignment = req.body; // Assuming req.body contains a single assignment object

  try {
    const existingAssignment = await Assignment.findOne({ task: assignment.task });

    if (existingAssignment) {
      // Update existing assignment
      const updatedAssignment = await Assignment.findByIdAndUpdate(existingAssignment._id, assignment, { new: true });
      res.status(200).send(updatedAssignment);
    } else {
      // Insert new assignment
      const newAssignment = await Assignment.create(assignment);
      res.status(201).send(newAssignment);
    }
  } catch (error) {
    console.error('Error saving assignment:', error);
    res.status(500).send({ error: 'Error saving assignment' });
  }
});

router.put('/updateTask/:taskId', async (req, res) => {
  const { taskId } = req.params;
  const updatedTaskData = req.body; // Assuming the request body contains updated task data

  try {
    // Find the task by ID and update it
    const updatedTask = await Assignment.findByIdAndUpdate(taskId, updatedTaskData, { new: true });

    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    res.json(updatedTask); // Respond with the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/assignments/:email', async (req, res) => {
  try {
    const assignments = await Assignment.find({ assignedBy: req.params.email });
    res.status(200).send(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send({ error: 'Error fetching assignments' });
  }
});


router.get('/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const assignments = await Assignment.find({ assignTo: email });
    res.status(200).send(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send({ error: 'Error fetching assignments' });
  }
});


router.get('/monitor/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const assignments = await Assignment.find({ assignedBy: email });

    res.send(assignments);
  } catch (error) {
    console.error('Error fetching assignments:', error);
    res.status(500).send({ error: 'Error fetching assignments' });
  }
});

router.delete('/del/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Assignment.findByIdAndDelete(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Error deleting task' });
  }
});


router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { percentComplete, isDone } = req.body;

  try {
    const updatedAssignment = await Assignment.findByIdAndUpdate(
      id,
      { percentComplete, isDone },
      { new: true }
    );

    if (!updatedAssignment) {
      return res.status(404).send({ error: 'Assignment not found' });
    }

    res.send(updatedAssignment);
  } catch (error) {
    console.error('Error updating assignment:', error);
    res.status(500).send({ error: 'Error updating assignment' });
  }
});

export default router;
