const express = require('express')
const router = express.Router()
const contactController = require('../controllers/contactController')

router.route('/')
    .get(contactController.getAllContacts)
    .post(contactController.createNewContact)
    .patch(contactController.updateContact)
    .delete(contactController.deleteContact)

module.exports = router