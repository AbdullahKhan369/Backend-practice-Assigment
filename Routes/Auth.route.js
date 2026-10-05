const { Router } = require('express');
const route = Router();

const { signUpSchema, loginSchema } = require('../Validations/auth.Validations')
const Validation = require('../lib/middlewares/validation.middleware')
const { signUp, login } = require('../Controllers/auth.controller')

route.post('/sign-up', Validation(signUpSchema), signUp)
route.post('/login', Validation(loginSchema), login)

module.exports = route;
