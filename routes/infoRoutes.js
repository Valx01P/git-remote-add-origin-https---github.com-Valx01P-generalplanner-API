const express = require('express')
const router = express.Router()
const infoController = require('../controllers/infoController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(infoController.getAllInfo)
    .post(infoController.createNewInfo)
    .patch(infoController.updateInfo)
    .delete(infoController.deleteInfo)

module.exports = router