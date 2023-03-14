const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

//For Tasks

//for creating task
router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        user_id: req.user._id
    })
    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//reading all tasks
router.get('/tasks', auth, async (req, res) => {
    const match = {}
    const sort = {}
    if (req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try {
        // const tasks = await Task.find({ user_id:req.user._id})
        await req.user.populate({
            path: 'tasks',
            match,
            options: {
                limit: parseInt(req.query.limit),
                skip: parseInt(req.query.skip),
                sort
            }
        })
        res.status(200).send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//read a specific task by Id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id
    try {
        const task = await Task.findOne({ _id, user_id: req.user._id })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//update task by Id
router.put('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowUpdates.includes(update))
    if (!isValidOperation) {
        res.status(400).send({ error: 'Invalid updates!' })
    }
    try {
        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        const task = await Task.findOne({ _id: req.params.id, user_id: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

//delete task by id
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user_id: req.user._id })
        if (!task) {
            res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send()
    }
})

module.exports = router