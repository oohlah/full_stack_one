import Joi from "joi";

// export const IdSpec = Joi.alternatives().try(Joi.string(), Joi.object()).description("a valid ID");

export const IdSpec = Joi.string().example("abc123").required();

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
    scope: Joi.string().valid("user", "admin").optional()
   
  })

// User Spec for Updating Email
export const UserSpecEmail = Joi.object().keys({
    email: Joi.string().email().example("homer@simpson.com").required(),
   
   
  })

  // User Spec for Updating Password
  export const UserSpecPassword = Joi.object().keys({
    currentPassword: Joi.string().example("secret").required(),
    password: Joi.string().example("secret").required(),
     });
   
  
// USER CREDENTIALS - Additional Properties

export const UserSpec = UserCredentialsSpec.keys({
    firstName: Joi.string().example("Homer").required(),
    lastName: Joi.string().example("Simpson").required(),
   
  })
  .label("UserDetails");


export const UserSpecPlus = UserSpec.keys({
  _id: IdSpec,
  scope: Joi.string().valid("user", "admin").optional(),
}).label("UserDetailsPlus");

export const UserArray = Joi.array().items(UserSpecPlus).label("UserArray");

// For validation of Update Placemark

export const PlacemarkSpecUpdate = Joi.object()
.keys({
  name: Joi.string().example("the liffey").required(),
  description: Joi.string().allow("").optional(),
  }).label("Update Placemark");

export const PlacemarkSpec = Joi.object()
.keys({
    name: Joi.string().example("the liffey").required(),
    // category: Joi.string().example("river").optional(),
    description: Joi.string().allow("").optional(),
    categoryid: IdSpec.required()
 
}).label("Placemark").optional();

export const PlacemarkSpecCreate = Joi.object().keys({
  name: Joi.string().example("the liffey").required(),
  category: Joi.string().example("river").optional(),
  description: Joi.string().allow("").optional(),
  categoryid: Joi.string().example("1234"),
}).label("PlacemarkCreate");




export const PlacemarkSpecPlus = Joi.object().keys({
  _id: IdSpec,
  name: Joi.string().required(),
  description: Joi.string().allow("").optional(),
  categoryid: IdSpec.required(),
  created: Joi.number().required(),

  location: Joi.object({
    lat: Joi.number().required(),
    lon: Joi.number().required(),
  }).optional(),

  temp: Joi.number().optional(),
  wind: Joi.number().optional(),

}).label("PlacemarkSpecPlus").optional();



// PlacemarkSpecPlus - includes additional response properties
export const PlacemarkArraySpec = Joi.array().items(PlacemarkSpecPlus).label("PlacemarkArray").optional();

export const CategorySpec =Joi.object()
.keys({
    title: Joi.string().example("river").required(),
    img: Joi.string().allow(null).optional()
})
.label("CategorySpec");



export const CategorySpecPlus = Joi.object({
   _id: IdSpec,
  title: Joi.string().required(),
  userid: IdSpec,
  img: Joi.string().allow(null).optional(),
  placemarks: PlacemarkArraySpec
}).label("CategorySpecPlus");

// without additional mongo propeties for validation
export const CategoryArraySpecV = Joi.array().items(CategorySpec).label("CategoryArray");

// response with additional mongo properties
export const CategoryArraySpec = Joi.array().items(CategorySpecPlus).label("CategoryArray");

export const JwtAuth = Joi.object()
  .keys({
    success: Joi.boolean().example("true").required(),
    token: Joi.string().example("eyJhbGciOiJND.g5YmJisIjoiaGYwNTNjAOhE.gCWGmY5-YigQw0DCBo").required(),
     name: Joi.string().optional(),
     _id: IdSpec.optional(),
  })
  .label("JwtAuth");
  