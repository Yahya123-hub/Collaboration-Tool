import express from "express";
import  Group  from "../models/group.js";

const router = express.Router();

router.get('/groups/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const groups = await Group.find({ members: email });
    res.status(200).json({ groups });
  } catch (error) {
    console.error('Error fetching groups:', error);
    res.status(500).json({ message: 'Error fetching groups' });
  }
});

export default router;
