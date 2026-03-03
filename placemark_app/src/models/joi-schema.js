import Joi from "joi";

export const UserSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
  })
  .label("UserDetails");

export const UserArray = Joi.array().items(UserSpec).label("UserArray");
};

export const UserCredentials = {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
};

export const CategorySpec = {
    title: Joi.string().required(),
};

export const placemarkSpec = {
    name: Joi.string().required(),
    description: Joi.string().required(),
};