const Info = require('../models/Info')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all info 
// @route GET /info
// @access Private
const getAllInfo = asyncHandler(async (req, res) => {
    // Get all info from MongoDB
    const info = await Info.find().lean()

    // If no info 
    if (!info?.length) {
        return res.status(400).json({ message: 'No info found' })
    }

    // Add username to each info before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop
    const infoWithUser = await Promise.all(info.map(async (info) => {
        const user = await User.findById(info.user).lean().exec()
        return { ...info, username: User.username }
    }))

    res.json(infoWithUser)
})

// @desc Create new info
// @route POST /info
// @access Private
const createNewInfo = asyncHandler(async (req, res) => {
    const { user, title, description } = req.body

    // Confirm data
    if (!user || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Check for duplicate title
    const duplicate = await Info.findOne({ title }).lean().exec()

    if (duplicate) {
        return res.status(409).json({ message: 'Duplicate info title' })
    }

    // Create and store the new user 
    const info = await Info.create({ user, title, description })

    if (info) { // Created 
        return res.status(201).json({ message: 'New info created' })
    } else {
        return res.status(400).json({ message: 'Invalid info data received' })
    }

})

// @desc Update a info
// @route PATCH /info
// @access Private
const updateInfo = asyncHandler(async (req, res) => {
    const { id, user, title, description } = req.body

    // Confirm data
    if (!id || !user || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm info exists to update
    const info = await Info.findById(id).exec()

    if (!info) {
        return res.status(400).json({ message: 'Info not found' })
    }

    // Check for duplicate title
    const duplicate = await Info.findOne({ title }).lean().exec()

    // Allow renaming of the original info 
    if (duplicate && duplicate?._id.toString() !== id) {
        return res.status(409).json({ message: 'Duplicate info title' })
    }

    info.user = user
    info.title = title
    info.description = description

    const updatedInfo = await info.save()

    res.json(`'${updatedInfo.title}' updated`)
})

// @desc Delete a info
// @route DELETE /info
// @access Private
const deleteInfo = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Info ID required' })
    }

    // Confirm info exists to delete 
    const info = await Info.findById(id).exec()

    if (!info) {
        return res.status(400).json({ message: 'Info not found' })
    }

    const result = await info.deleteOne()

    const reply = `Info '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllInfo,
    createNewInfo,
    updateInfo,
    deleteInfo
}


/*
INFO MODEL FOR REFERENCE

const mongoose = require('mongoose')

const infoSchema = new mongoose.Schema(
    {   //reference the user object ID to make this traceable to each individual user who created each unique one
        user: {
            type: mongoose.Schema.Types.ObjectId, //replaces default ID with user ID to track to user
            required: true,
            ref: 'User'
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Info', infoSchema)
*/