const allowedOrigins = require('./allowedOrigins')

const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true) //TAKE OFF !origin TO LIMIT IT TO THOSE ONLY IN THE ARRAY
        } else {                //IE NOT ALLOWING POSTMAN OR ANY OTHER NON-ORIGIN ENTITIES
            callback(new Error('Not allowed by CORS'))
        }//callback true if success, else return the cors error
    },
    credentials: true,
    //sets access control allowed credentials header to true
    //allows cookies to be set
    //allows authorization headers to be sent
    //allows TLS certificates to be sent
    //allows HTTP authentication to be sent
    //allows client side SSL certificates to be sent
    //allows cross origin redirects to be sent
    //allows cross origin preflight OPTIONS requests to be sent
    //allows cross origin preflight OPTIONS requests to be cached for 1 day
    optionsSuccessStatus: 200
    //sets the status code for OPTIONS requests to 200
    //allows OPTIONS requests to be sent
    //allows OPTIONS requests to be cached for 1 day
}

module.exports = corsOptions