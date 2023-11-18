const express = require('express')
const app = express()
const path = require('path')
const { logger } = require(`./middleware/logger`)
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const PORT = process.env.PORT || 3500
//log events
app.use(logger)
//cross origin resource sharing with our allowed origins
app.use(cors(corsOptions))
//parse json data
app.use(express.json())
//parse cookies received
app.use(cookieParser())

//slash is optional in /public, also public is relative so path.join isn't really necessary
app.use('/', express.static(path.join(__dirname, '/public')))
//index.html route
app.use('/', require('./routes/root'))
//routing for everything else, error stream
app.all('*', (req, res) => {
    res.status(404)
    if(req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if (req.accepts('json')) {
        res.json({message: '404 get fucked'})
    } else {
        res.type('txt').send('404. get fucked')
    }
})
//log and console log error
app.use(errorHandler)
//start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
