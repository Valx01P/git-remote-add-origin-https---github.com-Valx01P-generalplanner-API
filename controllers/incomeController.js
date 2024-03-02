const Income = require('../models/Income')
const User = require('../models/User')

// @desc Get all income 
// @route GET /income
// @access Private
const getAllIncome = async (req, res) => {
    try {
        const income = await Income.find().lean()

        if (!income?.length) {
            return res.status(400).json({ message: 'No income found' })
        }

        const incomeWithUser = await Promise.all(income.map(async (income) => {
            // Check if income.user is present before querying the User model
            if (income.user) {
                const user = await User.findById(income.user).lean().exec()
                return { ...income, username: user?.username || 'Unknown' }
            } else {
                return { ...income, username: 'Unknown' }
            }
        }))

        res.json(incomeWithUser)
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: 'Internal Server Error' })
    }
}

// @desc Create new income
// @route POST /income
// @access Private
const createNewIncome = async (req, res) => {
    const { user, amount, title, description } = req.body

    // Confirm data
    if (!user || !amount || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Create and store the new user 
    const income = await Income.create({ user, amount, title, description })

    if (income) { // Created 
        return res.status(201).json({ message: 'New income created' })
    } else {
        return res.status(400).json({ message: 'Invalid income data received' })
    }
}

// @desc Update a income
// @route PATCH /income
// @access Private
const updateIncome = async (req, res) => {
    const { id, amount, title, description } = req.body

    // Confirm data
    if (!id || !amount || !title || !description) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    // Confirm income exists to update
    const income = await Income.findById(id).exec()

    if (!income) {
        return res.status(400).json({ message: 'Income not found' })
    }

    income.amount = amount
    income.title = title
    income.description = description

    const updatedIncome = await income.save()

    res.json(`'${updatedIncome.title}' updated`)
}

// @desc Delete a income
// @route DELETE /income
// @access Private
const deleteIncome = async (req, res) => {
    const { id } = req.body

    // Confirm data
    if (!id) {
        return res.status(400).json({ message: 'Income ID required' })
    }

    // Confirm income exists to delete 
    const income = await Income.findById(id).exec()

    if (!income) {
        return res.status(400).json({ message: 'Income not found' })
    }

    const result = await income.deleteOne()

    const reply = `Income '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
}

module.exports = {
    getAllIncome,
    createNewIncome,
    updateIncome,
    deleteIncome
}


/*
INCOME MODEL FOR REFERENCE

const mongoose = require('mongoose')

const incomeSchema = new mongoose.Schema(
    {   //reference the user object ID to make this traceable to each individual user who created each unique one
        user: {
            type: mongoose.Schema.Types.ObjectId, //replaces default ID with user ID to track to user
            required: true,
            ref: 'User'
        },
        amount: {
            type: Number,
            required: true
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

module.exports = mongoose.model('Income', incomeSchema)
*/