const { logEvents } = require(`./logger`)

//logs errors using log events and prints them to the terminal
const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errLog.log')
    console.log(err.stack)
    //if it has a status code set then return that status code, else return a 500 server error
    const status = res.statusCode ? res.statusCode : 500
    //set the status to whatever the ternary determined
    res.status(status)

    res.json({ message: err.message, isError: true})
}

module.exports = errorHandler