const express = require('express')
const router = express.Router()
const shopController = require('../controllers/shop')

router.get('/' , shopController.showShopPage)

router.get('/ajax/:title', shopController.showOptions)

router.get('/details/:title/:id', shopController.showProductDetails)

module.exports = router