const { Router } = require("express")
const router = Router()

const Validation = require('../lib/middlewares/validation.middleware')
const { forgotPasswordSchema, resetPasswordSchema } = require('../Validations/auth.Validations')
const { forgotPassword, resetPassword } = require('../Controllers/forgotPassword.controller')

// step 1: user gives email, we send the reset link
router.post("/", Validation(forgotPasswordSchema), forgotPassword)

// step 2: user opens the link and sets a new password
router.post("/reset/:token", Validation(resetPasswordSchema), resetPassword)

module.exports = router;
