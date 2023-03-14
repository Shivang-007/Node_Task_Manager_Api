const express = require('express')
const User = require('../models/user')
const auth = require('../middleware/auth')
const multer = require('multer')
const router = new express.Router()

// For Users

//for creating user
router.post('/users', async (req, res) => {
    const user = new User(req.body)
    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })
    } catch (e) {
        res.status(400).send(e)
    }
})


//user login
router.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredential(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token, message: 'user successfully loggedin' })
    } catch (e) {
        res.status(400).send({ error: 'invalide username or password' })
    }
})

//logout user
router.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.status(200).send({ message: 'logged out successfully ' })
    } catch (e) {
        res.status(500).send()
    }
})


//logout from all session
router.post('/users/logout-all', auth, async (req, res) => {
    try {
        res.user.tokens = []
        await req.user.save()
        res.status(200).send({ message: 'logged out successfully from all session ' })
    } catch (e) {
        res.status(500).send()
    }
})

//getting user profile 
router.get('/users/me', auth, async (req, res) => {
    res.send(req.user)

    //fetch all users
    // try {
    //     const users = await User.find({})
    //     res.status(200).send(users)
    // } catch (e) {
    //     res.status(500).send()
    // }
})

//read a specific user by Id
// router.get('/users/:id',auth, async (req, res) => {
//     try {
//         const user = await User.findById(req.params.id)
//         if (!user) {
//             return res.status(400).send()
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(500).send()
//     }
// })




//update user profile
router.put('/users/me', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid updates!' })
    }
    try {

        //commented because middleware is not work on this line
        // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        // const user =await User.findById(req.user._id)

        updates.forEach((update) => req.user[update] = req.body[update])
        await req.user.save()
        res.status(200).send(req.user)
    } catch (e) {
        res.status(400).send()
    }
})


//update user by Id
// router.put('/users/:id',auth, async (req, res) => {
//     const updates = Object.keys(req.body)
//     const allowUpdates = ['name', 'email', 'password', 'age']
//     const isValidOperation = updates.every((update) => allowUpdates.includes(update))
//     if (!isValidOperation) {
//         res.status(400).send({ error: 'Invalid updates!' })
//     }
//     try {

//         //commented because middleware is not work on this line
//         // const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
//         const user =await User.findById(req.params.id)

//         updates.forEach((update) => user[update] = req.body[update])
//         await user.save()

//         if (!user) {
//             res.status(404).send()
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(400).send()
//     }
// })



//delete profile
router.delete('/users/me', auth, async (req, res) => {

    try {
        const user = await User.findOne({ _id: req.user._id })
        await user.deleteOne()
        res.status(200).send(user)
    } catch (e) {
        res.status(500).send()
    }
})

//delete user by id
// router.delete('/users/:id',auth, async (req, res) => {
//     try {
//         const user = await User.findByIdAndDelete(req.params.id)
//         if (!user) {
//             res.status(404).send()
//         }
//         res.status(200).send(user)
//     } catch (e) {
//         res.status(400).send()
//     }
// })


//upload avatar
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please upload image'))
        }
        cb(undefined, true)
    }
})
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.status(200).send({ message: 'avatar uploaded successfully' })
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})


//delete an avatar
router.delete('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.status(200).send({ message: 'avatar deleted successfully' })
})


//getting an avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        if (!user || !user.avatar) {
            throw new Error()
        }
        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})

module.exports = router

