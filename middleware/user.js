const Joi = require("joi");
const json = require("jsonwebtoken");
const userSchema = require("../models/userSchema");
require("dotenv").config();

module.exports = {
  registerValidator: async (req, res, next) => {
    try {
      const Schema = Joi.object({
        name: Joi.string().required().label("Username"),
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
        gender: Joi.string().optional().valid("male", "female").label("Gender"),
      });
      const response = Schema.validate(req.body);
      if (response.error) {
        res.json({ err: response.error.message });
      } else {
        next();
      }
    } catch (error) {
      res.json({ err: error.message });
    }
  },
  loginValidator: async (req, res, next) => {
    try {
      const Schema = Joi.object({
        email: Joi.string().email().required().label("Email"),
        password: Joi.string().required().label("Password"),
      });
      const response = Schema.validate(req.body);
      if (response.error) {
        res.json({ err: response.error.message });
      } else {
        next();
      }
    } catch (error) {
      res.json({ err: error.message });
    }
  },
  otpValidator: async (req, res, next) => {
    try {
      const Schema = Joi.object({
        otp: Joi.number().label("otp"),
        password: Joi.string().required().label("Password"),
      });
      const response = Schema.validate(req.body);
      if (response.error) {
        res.status(400).json({ message: response.error.message });
      } else {
        next();
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  tokenVerify: async (req, res, next) => {
    try {
      let bearer = req.headers["authorization"];
      if (bearer !== undefined) {
        bearer = bearer.split(" ")[1];
        const verify = json.verify(bearer, process.env.secrate);
        let checkIdExist = await userSchema.findById(verify.id);
        if (checkIdExist) {
          req.userid = checkIdExist.id;
          req.userName = checkIdExist.name;
          next();
        } else {
          res.status(400).json({ message: "this id is not exist" });
        }
      } else {
        res.status(400).json({ message: "Token is required" });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
