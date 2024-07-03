import express from 'express';
import {User} from '../models/user.js'; 

const router = express.Router();

router.get('/getusers', async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

export default router;
