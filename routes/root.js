const express = require('express')
const router = express.Router()
const path = require('path')
//if path stars with / and ends with it, or if path ends with /index, or
//if path ends with /index.html, then send the index.html page
router.get('^/$|/index(.html)?', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})

module.exports = router