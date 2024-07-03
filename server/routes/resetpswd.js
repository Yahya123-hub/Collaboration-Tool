import { Router } from "express";
import { User } from "../models/user.js";
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import passwordComplexity from "joi-password-complexity";
import dotenv from 'dotenv';
dotenv.config();

const router = Router();

const complexityOptions = {
  min: 8,
  max: 30,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const passwordSchema = Joi.object({
  password: passwordComplexity(complexityOptions).required().label("Password")
});

router.post('/:id/:token', async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;
  
    //console.log('ID from URL:', id);
    //console.log('Token:', token);
  
    const { error: passwordError } = passwordSchema.validate({ password });
    if (passwordError) {
      return res.status(400).json({ Status: "Error", message: "Password does not meet complexity requirements" });
    }
  
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
      console.log('Decoded:', decoded);
  
      if (decoded.id !== id) {
        return res.status(400).json({ Status: "Error", message: "Invalid token or user ID" });
      }
  
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ Status: "Error", message: "User not found" });
      }
  
      const isSamePassword = await bcrypt.compare(password, user.password);
      if (isSamePassword) {
        return res.status(400).json({ Status: "Error", message: "New password must be different from the old password" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();
      res.send({ Status: "Success" });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ Status: "Error", message: "Internal Server Error" });
    }
  });
  

export default router;
