const express = require('express')
const router = express.Router()
const incomeController = require('../controllers/incomeController')

router.route('/')
    .get(incomeController.getAllIncome)
    .post(incomeController.createNewIncome)
    .patch(incomeController.updateIncome)
    .delete(incomeController.deleteIncome)

module.exports = router