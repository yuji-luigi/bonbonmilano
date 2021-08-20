const express = require('express')
const router = express.Router()
const cartController = require('../controllers/cart')



router.get('/', cartController.showCart)
// '/add/
router.post('/', cartController.addToCart)
// '/gift_form/:id
router.get('/register/:id', cartController.showParselRegistration)
// '/gift_form/:id
router.post('/register/:id', cartController.registerParcelDetails)
// '/gift_form/:id/confirmation
router.get('/confirm_address_data/:id', cartController.showConfirmation)
// '/gift_form/completed
router.get('/confirm/ok', cartController.addressConfirmed)


router.get('/product/:id', cartController.getOneItemFromCart, cartController.showProductAndParselDetails)
router.get('/product/modify/:id',cartController.getOneItemFromCart, cartController.showPartyInfoModifyPage)
router.post('/product/modify/:id',cartController.getOneItemFromCart, cartController.modifyPartyInfo)


router.delete('/:id', cartController.deleteOneItem)

router.get('/purchase', cartController.showPurchaseBill)
router.post('/purchase',  cartController.createCheckoutSession)

router.get('/payment.success', cartController.pushOrderinDB, cartController.deleteAllCartItems, cartController.paymentSuccess)
router.get('/payment.cancel', cartController.paymentCancel)

module.exports = router