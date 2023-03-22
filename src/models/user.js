const mongoose = require('mongoose')
const validator = require('validator')
const Task = require('./task')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('invalid email')
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error('invalid password')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 0) {
                throw new Error('invalid age')
            }
        }
    },
    avatar: {
        type: Buffer
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }

    ]
}, {
    timestamps: true
})

//virtual relation with task
userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user_id'
})


//dont display password and token
userSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}


//create JWT token
userSchema.methods.generateAuthToken = async function () {
    const user = this
    const token = jwt.sign({ _id: user.id.toString() }, process.env.JWT_SECRET, { expiresIn: '24h' })
    user.tokens = user.tokens.concat({ token })
    await user.save()
    return token
}

//validation for login
userSchema.statics.findByCredential = async (email, password) => {
    const user = await User.findOne({ email })
    if (!user) {
        throw new Error('unable to login')
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
        throw new Error('unable to login')
    }
    return user
}


//Hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

//delete a user task when user is removed
userSchema.pre('deleteOne', async function (next) {
    const user = this
    console.log(user)
    await Task.deleteMany({ user_id: user._id })
    next()
})
const User = mongoose.model('User', userSchema)


module.exports = User