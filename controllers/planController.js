const Plan = require('../models/Plan')
const User = require('../models/User')
const asyncHandler = require('express-async-handler')

// @desc Get all plan 
// @route GET /plan
// @access Private
const getAllPlans = asyncHandler(async (req, res) => {
    // Get all plan from MongoDB
    const plans = await Plan.find().lean()

    // If no plan 
    if (!plans?.length) {
        return res.status(400).json({ message: 'No plans found' })
    }

    // Add username to each plan before sending the response 
    // See Promise.all with map() here: https://youtu.be/4lqJBBEpjRE
    // You could also do this with a for...of loop
    const plansWithUser = await Promise.all(plans.map(async (plans) => {    //get all the plans for a specific user using their ID
        const user = await User.findById(plans.user).lean().exec()
        return { ...plans, username: user.username } //return the array of plans for that user
    }))

    res.json(plansWithUser)
})

// @desc Create new plan
// @route POST /plan
// @access Private
const createNewPlan = asyncHandler(async (req, res) => {
    const { user, date, description } = req.body

    // Confirm data
    if (!user || !date || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new user 
    const plan = await Plan.create({ user, date, description })

    if (plan) { // Created 
        return res.status(201).json({ message: 'New plan created' })
    } else {
        return res.status(400).json({ message: 'Invalid plan data received' })
    }

})

// @desc Update a plan
// @route PATCH /plan
// @access Private
const updatePlan = asyncHandler(async (req, res) => {
    const { id, user, date, description } = req.body

    // Confirm data
    if (!id || !user || !date || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm plan exists to update
    const plan = await Plan.findById(id).exec()

    if (!plan) {
        return res.status(400).json({ message: 'Plan not found' })
    }

    plan.user = user
    plan.date = date
    plan.description = description

    const updatedPlan = await plan.save()

    res.json(`Plan '${updatedPlan.id}' updated`)
})

// @desc Delete a plan
// @route DELETE /plan
// @access Private
const deletePlan = asyncHandler(async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Plan ID required' })
    }

    // Confirm plan exists to delete 
    const plan = await Plan.findById(id).exec()

    if (!plan) {
        return res.status(400).json({ message: 'Plan not found' })
    }

    const result = await plan.deleteOne()

    const reply = `Plan ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllPlans,
    createNewPlan,
    updatePlan,
    deletePlan
}

/*
PLAN MODEL FOR REFERENCE

const mongoose = require('mongoose')

const planSchema = new mongoose.Schema(
    {   //reference the user object ID to make this traceable to each individual user who created each unique one
        user: {
            type: mongoose.Schema.Types.ObjectId, //replaces default ID with user ID to track to user
            required: true,
            ref: 'User'
        },
        date: {
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

module.exports = mongoose.model('Plan', planSchema)
*/