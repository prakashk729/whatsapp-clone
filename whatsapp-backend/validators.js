import Joi from "joi";

const messagePayloadValidator = (msg) => {
  const schema = Joi.object({
    message: Joi.string().alphanum(),
    received: Joi.boolean(),
  });
  return schema.validate({ message: "sad12ewqeq", received: "dasdas" });
};

const userSchemaValidator = (body) => {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(body);
};

const userAuthValidator = (body) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(body);
};

export { messagePayloadValidator, userSchemaValidator, userAuthValidator };
