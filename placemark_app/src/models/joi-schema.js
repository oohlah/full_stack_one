import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
 .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
})
.label("UserCredentials");

export const UserSpec = Joi.object()
  .keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
   
  })
  .label("UserDetails");



export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PlacemarkSpec = Joi.object()
.keys({
    name: Joi.string().example("the liffey").required(),
    description: Joi.string().required(),
}).label("PlacemarkSpec");

export const PlacemarkSpecPlus = PlacemarkSpec
.keys({ 
    _id: IdSpec,
  __v: Joi.number(),
}).label("PlacemarkSpecPlus");

export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");

export const CategorySpec =Joi.object()
.keys({
    title: Joi.string().example("rivers").required(),
    _id: IdSpec,
    userid: IdSpec,
    placemarks: PlacemarkArraySpec,
  __v: Joi.number(),
})
.label("CategorySpec");


export const CategorySpecPlus = CategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CategorySpecPlus");

export const CategoryArray = Joi.array().items(CategorySpecPlus).label("CategoryArray");

