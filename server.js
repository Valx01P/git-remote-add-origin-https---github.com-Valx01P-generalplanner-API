require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const { logger, logEvents } = require(`./middleware/logger`)
const errorHandler = require('./middleware/errorHandler')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const corsOptions = require('./config/corsOptions')
const connectDB = require('./config/dbConn')
const mongoose = require('mongoose')
const PORT = process.env.PORT || 3500

console.log(process.env.NODE_ENV)
//connect to MongoDB
connectDB()

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
//TODO ADD API ENDPOINTS, ROUTES, AND CONTROLLERS FOR EACH DATA MODEL
app.use('/auth', require('./routes/authRoutes'))
app.use('/users', require('./routes/userRoutes'))
app.use('/info', require('./routes/infoRoutes'))
app.use('/income', require('./routes/incomeRoutes'))
app.use('/contacts', require('./routes/contactRoutes'))
app.use('/plans', require('./routes/planRoutes'))


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
//start server, say when server is running on MongoDB
mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
})
//log any connection errors when connecting to MongoDB
mongoose.connection.on('error', err => {
    console.log(err)
    logEvents(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, 'mongoErrLog.log')
})