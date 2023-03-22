const app = require('./app')
// const nodemailer = require('nodemailer');
// require('./db/mongoose')
// const userRouter = require('./routers/user')
// const taskRouter = require('./routers/task')
// const app = express()
// app.use(express.json())
// app.use(userRouter)
// app.use(taskRouter)
const port = process.env.PORT

app.listen(port, () => {
    console.log(`server is running on ${port}`)
})

//sending and email
// let mailTransporter = nodemailer.createTransport({
//     host: "sandbox.smtp.mailtrap.io",
//     port: 2525,
//     auth: {
//         user: "a078a0857efc11",
//         pass: "d208c59ed33285"
//     }
// })

// let details = {
//     from:'shivangrathod007@gmail.com',
//     to:'user1@example.com',
//     subject:'Test email',
//     text:'testing our first email with node mailer'
// }
// mailTransporter.sendMail(details,(error)=> {
//     if(error){
//         console.log(error)
//     }else{
//         console.log('email has been sent')
//     }
// })

