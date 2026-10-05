const joi = require('joi')
const { passwordRegex } = require("../lib/regex/auth.regex.js")

const passwordRule = joi.string().regex(passwordRegex).required().messages({
  "string.pattern.base":
    "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
})

const signUpSchema = joi.object({
  email: joi.string().email().required(),
  password: passwordRule,
})

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
})

const forgotPasswordSchema = joi.object({
  email: joi.string().email().required(),
})

const resetPasswordSchema = joi.object({
  password: passwordRule,
})

module.exports = { loginSchema, signUpSchema, forgotPasswordSchema, resetPasswordSchema }
