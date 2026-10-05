const express = require('express');
const router = express.Router();

const LeadsRouter = require('./Leads.routes')
const AuthRouter = require('./Auth.route')
const checkRouter = require('./check.route')
const forgotPasswordRouter = require('./forgotPassword.route')

router.use("/leads" , LeadsRouter)
router.use("/auth" , AuthRouter)
router.use("/check" , checkRouter)
router.use("/forgot-password" , forgotPasswordRouter)

module.exports = router;
