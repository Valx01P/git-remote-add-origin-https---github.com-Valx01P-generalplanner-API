const express = require('express')
const router = express.Router()
const incomeController = require('../controllers/incomeController')
const verifyJWT = require('../middleware/verifyJWT')

router.use(verifyJWT)

router.route('/')
    .get(incomeController.getAllIncome)
    .post(incomeController.createNewIncome)
    .patch(incomeController.updateIncome)
    .delete(incomeController.deleteIncome)

module.exports = router