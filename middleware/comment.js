const Joi = require("joi");

module.exports = {
  commentAddValidator: async (req, res, next) => {
    try {
      const Schema = Joi.object({
        body: Joi.string().required().label("body"),
        postid: Joi.string().required().label("postid"),
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
  commentReplyValidator: async (req, res, next) => {
    try {
      const Schema = Joi.object({
        commentId: Joi.objectId().required().label("otp"),
        body: Joi.string().required().label("content"),
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
};
