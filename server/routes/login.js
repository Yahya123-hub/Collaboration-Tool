import { Router } from "express";
import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import Joi from "joi";
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const { email, password } = req.body;

    //if (!recaptchaToken) {
    //  return res.status(400).send({ message: "reCAPTCHA token is missing" });
    //}

    // Verify the reCAPTCHA token
    /*const recaptchaSecretKey = process.env.RECAPTCHA_SECRET_KEY;
    const recaptchaVerificationUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`;

    const recaptchaResponse = await axios.post(recaptchaVerificationUrl);
    if (!recaptchaResponse.data.success) {
      return res.status(400).send({ message: "reCAPTCHA verification failed" });
    }*/

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Email or Password" });
    }

    const token = user.generateAuthToken();
    res.status(200).send({ data: token, message: "Logged in successfully" });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error" });
  }
});

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
  });
  return schema.validate(data);
};

export default router;
