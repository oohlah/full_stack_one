import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
 .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
})
.label("UserCredentials");

export const UserSpec = UserCredentialsSpec.keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
   
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
    category: Joi.string().example("river").optional(),
    description: Joi.string().example("It's a river in Dublin").required(),
    categoryid: IdSpec,
    // categoryid: Joi.string().example("69ad51f88992c30c19e8ce7c").required(),

}).label("PlacemarkSpec");

export const PlacemarkSpecPlus = PlacemarkSpec
.keys({ 
    _id: IdSpec,
   __v: Joi.number(),
   location: Joi.object({
    lat: Joi.number(),
    lon: Joi.number()
  }).optional(),
  temp: Joi.number().optional(),
  wind: Joi.number().optional()
}).label("PlacemarkSpecPlus");


// // this is for category validation
// export const PlacemarkArraySpecV = Joi.array().items(PlacemarkSpec).label("PlacemarkArray");

// // using PlacemarkSpec to remove mongo response - without additional properties
// export const PlacemarkArraySpecV = Joi.array().items(PlacemarkSpec).label("PlacemarkArray");

// PlacemarkSpecPlus - includes additional response properties
export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray");

export const CategorySpec =Joi.object()
.keys({
    title: Joi.string().example("rivers").required(),
    userid: IdSpec,
    placemarks: Joi.array().items(PlacemarkSpecPlus).optional()
})
.label("CategorySpec");



export const CategorySpecPlus = CategorySpec.keys({
  _id: IdSpec,
  __v: Joi.number(),
}).label("CategorySpecPlus");

// without additional mongo propeties for validation
export const CategoryArraySpecV = Joi.array().items(CategorySpec).label("CategoryArray");

// response with additional mongo properties
export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
  })
  .label("JwtAuth");
  