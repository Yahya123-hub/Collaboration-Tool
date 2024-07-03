import express from 'express';
import dns from 'dns';
import { User } from "../models/user.js";
import CollaborationRequest from '../models/collabreq.js';
import Group from '../models/group.js';
import { v4 as uuidv4 } from 'uuid';
import SibApiV3Sdk from 'sib-api-v3-sdk';

const router = express.Router();

// Helper function to check if the email domain can receive messages
const checkEmailDomain = (email) => {
  return new Promise((resolve) => {
    const domain = email.split('@')[1];
    dns.resolveMx(domain, (err, addresses) => {
      if (err || addresses.length === 0) {
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
};

// Function to send email using Sendinblue
const sendMail = async (email, token, roomId) => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKey = SibApiV3Sdk.ApiClient.instance.authentications['api-key'];
    apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();
    sendSmtpEmail.to = [{ email }];
    sendSmtpEmail.sender = { email: process.env.SENDER_EMAIL };
    sendSmtpEmail.subject = 'Collaboration Request';
    sendSmtpEmail.textContent = `You have a new collaboration request. \n\nYour Room ID: ${roomId}.  Click the link to accept: http://localhost:3001/api/collaborators/accept/${token}`;

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Message sent: %s', data.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error; // Rethrow the error to propagate it up
  }
};

// Route to handle collaboration request
router.post('/request', async (req, res) => {
  const { email, senderEmail } = req.body;

  try {
    // Check if the email domain can receive messages
    const canReceiveEmail = await checkEmailDomain(email);
    if (!canReceiveEmail) {
      return res.status(400).json({ message: 'Invalid email domain.' });
    }

    const user = await User.findOne({ email });
    const sender = await User.findOne({ email: senderEmail });

    if (!user || !sender) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const token = uuidv4();
    const roomId = uuidv4(); // Generate a room ID
    const collaborationRequest = new CollaborationRequest({ email, token, senderEmail });
    await collaborationRequest.save();

    await sendMail(email, token, roomId);

    res.status(200).json({ message: 'Collaboration request sent' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending collaboration request.' });
  }
});

// Route to handle acceptance of collaboration request
router.get('/accept/:token', async (req, res) => {
  const { token } = req.params;

  try {
    const request = await CollaborationRequest.findOne({ token });

    if (!request) {
      return res.status(404).json({ message: 'Invalid token.' });
    }

    const group = new Group({ members: [request.senderEmail, request.email] });
    await group.save();

    await CollaborationRequest.deleteOne({ token });

    // Redirect to sign-in page after acceptance
    res.redirect('/');
  } catch (error) {
    res.status(500).json({ message: 'Error accepting collaboration request.' });
  }
});

export default router;
