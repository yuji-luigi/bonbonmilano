const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')
const logger = require('../middleware/logger')
const sendVerifyEmail = require('../middleware/email_verification').sendVerifyEmail


router.get('/register', (req, res) => {
  const user = req.user
  res.render('auth/user', {user})})
router.post('/register', authController.newRegistration)
router.delete('/register/cancel', authController.deleteUser)
router.post('/register/confirm', authController.showConfirmation)
router.post('/register/confirm/send_email', authController.setConfirmMail, sendVerifyEmail)
router.get('/register/confirm/send_email/completed', authController.showEmailSentPage)
router.get('/email_confirmation/:token', authController.verifyUser, logger)

router.get('/guest/register', authController.showGuestRegistration)
router.post('/guest/register', authController.newRegistration)
router.post('/guest/register/confirm', authController.showConfirmationToPurchase)
router.post('/guest/register/confirm/send_email', authController.setConfirMailToPurchase, sendVerifyEmail)
router.get('/guest/register/confirm/send_email/completed', authController.showEmailSentPageToPurchase)
router.get('/email_confirmation/topurchase/:token', authController.verifyUserToPurchase, logger )



router.get('/login', (req, res) =>{
  const user = req.user
  res.render('auth/login',{user})
})

router.post('/login', authController.userLogin , logger)
router.get('/logout', authController.userLogout)

router.get('/resend_form', authController.showResendEmailForm)
router.post('/resend_form', )

router.get('/user_account', authController.showAccountInfo)
router.get('/user_account/modify', authController.showModifyPage)
router.post('/user_account/modify', authController.modifyUser)

module.exports = router