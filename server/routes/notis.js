import express from "express";
import Notification from "../models/alerts.js";

const router = express.Router();

router.get('/getnotis/:email', async (req, res) => {
  const { email } = req.params;
  try {
    const notifications = await Notification.find({ email });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).send('Error fetching notifications');
  }
});

router.post('/addnotification', async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.status(200).json({ message: 'Notification saved successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error saving notification', error });
  }
});

router.delete('/clear/:email', async (req, res) => {
  const { email } = req.params;
  try {
    await Notification.deleteMany({ email });
    res.status(200).send({ message: 'Notifications cleared' });
  } catch (error) {
    res.status(500).send({ error: 'Error clearing notifications' });
  }
});

export default router;
