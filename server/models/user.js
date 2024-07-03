import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("user", userSchema);

const validate = (data) => {
  const nameRegex = /^[a-zA-Z]+$/; // Regex to match only letters

  const schema = Joi.object({
    firstName: Joi.string()
      .regex(nameRegex)
      .max(15)
      .required()
      .messages({
        'string.base': `"First Name" must be a string`,
        'string.empty': `"First Name" cannot be empty`,
        'string.pattern.base': `"First Name" must only contain letters`,
        'string.max': `"First Name" must be less than or equal to {#limit} characters`,
        'any.required': `"First Name" is required`,
      }),
    lastName: Joi.string()
      .regex(nameRegex)
      .max(15)
      .required()
      .messages({
        'string.base': `"Last Name" must be a string`,
        'string.empty': `"Last Name" cannot be empty`,
        'string.pattern.base': `"Last Name" must only contain letters`,
        'string.max': `"Last Name" must be less than or equal to {#limit} characters`,
        'any.required': `"Last Name" is required`,
      }),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(data);
};


export { User, validate };
