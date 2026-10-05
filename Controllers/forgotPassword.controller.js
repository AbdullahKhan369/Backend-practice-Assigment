const crypto = require('crypto')
const bcrypt = require('bcrypt')
const { getDB } = require("../lib/helpers/db");
const sendMail = require("../lib/helpers/mailer");

// token ko DB me hash karke rakhte h (password ki tarah), taake DB leak ho to bhi link use na ho sake
const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex")
}

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body
    const db = getDB()

    // chahe email registered ho ya na ho, same reply dena h
    const message = "If this email is registered, a password reset link has been sent"

    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return res.status(200).send({ message })
    }

    // random token banao, 15 min ki expiry k sath
    const resetToken = crypto.randomBytes(32).toString("hex")
    const expiry = new Date(Date.now() + 15 * 60 * 1000)

    await db.collection("users").updateOne(
      { email },
      { $set: { resetPasswordToken: hashToken(resetToken), resetPasswordExpires: expiry } }
    )

    const resetLink = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    try {
      await sendMail({
        to: email,
        subject: "Reset your password",
        html: `
          <p>Hello,</p>
          <p>You asked to reset your password. Click the link below to set a new one:</p>
          <p><a href="${resetLink}">${resetLink}</a></p>
          <p>This link will expire in 15 minutes. If you did not ask for this, you can ignore this email.</p>
        `,
      })
    } catch (mailError) {
      // mail na jaye to token hata do, warna user k pas link hi nahi hoga
      console.log("Mail error:", mailError.message)
      await db.collection("users").updateOne(
        { email },
        { $unset: { resetPasswordToken: "", resetPasswordExpires: "" } }
      )
      return res.status(500).send({ message: "Could not send email, please try again" })
    }

    res.status(200).send({ message })
  } catch (error) {
    console.log("Forgot password error:", error)
    res.status(500).send({ message: "Something went wrong" })
  }
}

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params
    const { password } = req.body
    const db = getDB()

    // token match ho aur expire na hua ho
    const user = await db.collection("users").findOne({
      resetPasswordToken: hashToken(token),
      resetPasswordExpires: { $gt: new Date() },
    })

    if (!user) {
      return res.status(400).send({ message: "Reset link is invalid or has expired" })
    }

    const hashedPass = await bcrypt.hash(password, 10)

    // naya password save karo aur token hata do taake link dobara use na ho
    await db.collection("users").updateOne(
      { _id: user._id },
      {
        $set: { password: hashedPass },
        $unset: { resetPasswordToken: "", resetPasswordExpires: "" },
      }
    )

    res.status(200).send({ message: "Password reset successful, you can login now" })
  } catch (error) {
    console.log("Reset password error:", error)
    res.status(500).send({ message: "Something went wrong" })
  }
}

module.exports = { forgotPassword, resetPassword }
