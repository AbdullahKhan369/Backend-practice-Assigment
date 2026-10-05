const express = require('express');
const app = express()
const port = 3000
const apiRoute = require('./Routes/index.route')
const bodyParser = require('body-parser')
const { connectDB } = require('./lib/helpers/db')

app.use(bodyParser.json())
app.use("/api", apiRoute)

// connect to the database first, then start accepting requests
connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}).catch((err) => {
  console.log("Database connection failed:", err.message)
})
