const express = require ('express')
const branchAppointment = require('../controller/branchRequestController')
const {verifyToken} = require ('../middleware/verifytokens')
const router = express.Router()


router.route('/').post(verifyToken,branchAppointment.createBranchAppointment)


module.exports = router; 