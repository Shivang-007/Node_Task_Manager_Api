const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true }, { useCreateIndex: true })

// const User = mongoose.model('User', {
//     name: {
//         type:String,
//         required:true,
//         trim:true,
//     },
//     email: {
//         type:String,
//         required:true,
//         lowercase:true,
//         trim:true,
//         validate(value){
//             if(!validator.isEmail(value)){
//                 throw new Error('invalid email')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         minLength:7,
//         trim:true,
//         validate(value){
//             if(value.toLowerCase().includes("password")){
//                 throw new Error('invalid password')
//             }
//         }
//     },
//     age: {
//         type:Number,
//         validate(value){
//             if(value<0){
//                 throw new Error('invalid age')
//             }
//         }
//     }
// })

// const me = new User({
//     name:'  parth   ',
//     email:'   parth@gmail.com',
//     password:'parth@123',
//     age:20
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })


// const Task = mongoose.model('Task', {
//     description: {
//         type:String,
//         required:true,
//         trim:true
//     },
//     completed: {
//         type:Boolean,
//         default:false
//     }
// })

// const me = new Task({
//     description:'Dinner    '
// })

// me.save().then((me) => {
//     console.log(me)
// }).catch((error) => {
//     console.log(error)
// })