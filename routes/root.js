const express = require('express')
const router = express.Router()
const path = require('path')

//ROUTING LOGIC TO BE USED IN SERVER JS WHEN FETCHING SPECIFICALLY THE HOMEPAGE IE THE ROOT /

//regular expression, REGEX
//if path stars with / and ends with it, or if path ends with /index, or
//if path ends with /index.html, then send the index.html page
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

//export router with newly defined routing logic
module.exports = router