const express = require('express')
// const nodemailer = require('nodemailer');
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')
const app = express()
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
const port = process.env.PORT

module.exports = app
