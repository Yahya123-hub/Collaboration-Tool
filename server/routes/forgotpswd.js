import { Router } from "express";
import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import Bottleneck from 'bottleneck';
import dns from 'dns';

dotenv.config();

const router = Router();

const limiter = new Bottleneck({
  minTime: 1000, // 1 second between each email
  maxConcurrent: 1, // Only 1 concurrent connection
});

router.post('/', async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send({ status: "User not found" });
    }

    const isEmailValid = await checkEmailDomain(email);
    if (!isEmailValid) {
      return res.status(400).send({ status: "Invalid email domain" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1d" });
    await limiter.schedule(() => sendMail(email, user._id, token));
    return res.send({ status: "Success", message: "Check your mail, redirecting to login" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).send({ status: "Error", message: "Internal Server Error" });
  }
});

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

const sendMail = async (email, userId, token) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // use STARTTLS
    auth: {
      user: process.env.OUTLOOK_EMAIL,
      pass: process.env.OUTLOOK_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.OUTLOOK_EMAIL,
    to: email,
    subject: 'Reset Password Link',
    text: `Click the link to reset your password: http://localhost:5173/reset-password/${userId}/${token}`,
  };

  await transporter.sendMail(mailOptions);
};

export default router;
