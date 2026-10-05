const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { getDB } = require("../lib/helpers/db");

const signUp = async (req, res) => {
  try {
    const { email, password } = req.body
    const db = getDB()

    // same email se dobara account na ban sake
    const alreadyExists = await db.collection("users").findOne({ email })
    if (alreadyExists) {
      return res.status(409).send({ message: "Email is already registered" })
    }

    const hashedPass = await bcrypt.hash(password, 10)
    await db.collection("users").insertOne({
      email,
      password: hashedPass,
      createdAt: new Date(),
    })

    // password (even hashed) response me wapis nahi bhejna
    res.status(201).send({ message: "Account created successfully", email })
  } catch (error) {
    console.log("Sign up error:", error)
    res.status(500).send({ message: "Something went wrong" })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const db = getDB()

    const user = await db.collection("users").findOne({ email })
    // ek hi message dono cases me, taake koi guess na kar sake k email registered h ya nahi
    if (!user || !user.password) {
      return res.status(401).send({ message: "Invalid email or password" })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).send({ message: "Invalid email or password" })
    }

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" })
    res.status(200).send({ message: "Login Successful", token })
  } catch (error) {
    console.log("Login error:", error)
    res.status(500).send({ message: "Something went wrong" })
  }
}

module.exports = { signUp, login }
