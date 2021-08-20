const express = require('express')
const router = express.Router()
const adminController = require('../controllers/admin')

router.get('/', adminController.showIndexPage)

router.delete('/delete/:id', adminController.deleteAccount)

module.exports = router