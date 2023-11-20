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