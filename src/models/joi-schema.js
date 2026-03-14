import Joi from "joi";

export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const UserCredentialsSpec = Joi.object()
 .keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
    password: Joi.string().example("secret").required(),
})
.label("UserCredentials");

// User Spec for Updating First and last Name
export const UserSpecName = Joi.object().keys({
    firstName: Joi.string().example("Homer").optional(),
    lastName: Joi.string().example("Simpson").optional(),
   
  })

// User Spec for Updating Email
export const UserSpecEmail = Joi.object().keys({
    email: Joi.string().email().example("homer@simpson.com").optional(),
   
   
  })
// USER CREDENTIALS - Additional Properties

export const UserSpec = UserCredentialsSpec.keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
   
  })
  .label("UserDetails");

export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  __v: Joi.number().optional(), // part of mongo
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

export const PlacemarkSpec = Joi.object()
.keys({
    name: Joi.string().example("the liffey").required(),
    category: Joi.string().example("river").optional(),
    description: Joi.string().example("It's a river in Dublin").required(),
    categoryid: IdSpec,
    location: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
  }).optional(),
    temp: Joi.number().optional(),
    wind: Joi.number().optional(),

   

}).label("Placemark").optional();

export const PlacemarkSpecPlus = PlacemarkSpec
.keys({ 
   _id: IdSpec,
   __v: Joi.number(),
   created: Joi.number().required(),
}).label("PlacemarkSpecPlus").optional();


// // this is for category validation
// export const PlacemarkArraySpecV = Joi.array().items(PlacemarkSpec).label("PlacemarkArray");

// // using PlacemarkSpec to remove mongo response - without additional properties
// export const PlacemarkArraySpecV = Joi.array().items(PlacemarkSpec).label("PlacemarkArray");

// PlacemarkSpecPlus - includes additional response properties
export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray").optional();

export const CategorySpec =Joi.object()
.keys({
    title: Joi.string().example("river").required(),
    userid: IdSpec,
    placemarks: PlacemarkArraySpec,
    // placemarks: Joi.array().items(PlacemarkSpecPlus).optional()
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
  