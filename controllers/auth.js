const User = require('../models/User')
const bcrypt = require('bcrypt')
const findCart = require('./cart').findCart
const Token = require('../models/Token')


exports.newRegistration =  async (req, res, next) =>{
  const {via, tel, cap, username, citta, email, password} = req.body 
  const userdata = {email, password, via, tel, cap, username, citta}
  const userdataArray = Object.values(userdata)
  const inputErr =  userdataArray.some(data => data.length === 0)
  if(inputErr === true){
    return res.send({message: 'Please fill all the forms', error: 'input error'})
  }

try{
  const foundUser = await User.findOne({email})
  if (foundUser) {
    return res.send({message: 'the email has been already registerd', error: 'user duplication'})
    }
    const salt = await bcrypt.genSalt()
    const hashedPassword = await bcrypt.hash(password, salt)
    userdata.password = hashedPassword
   
    const newUserData = userdata    
    const newUser = new User(newUserData)
    await newUser.save()
    // logger has been removed
    // i need to pass the req.user to logger in order to generate 2 tokens.
    // but i also need to handle these with frontend fetchAPI
    // that means i can't remove res.send(data)
    // => see logger (anothe fetch request in frontend with req.body = email <= destructure this in backend and pass 2 cookies)
    const data = {via, tel, cap, username, citta, email}
    res.json(data)

}catch(err) {
  res.status(500).send({ message:`Please check each forms`, error: "error", err})
}
}



exports.userLogin = async (req, res, next) => {
  const {
    email,
    password
  } = req.body
  if ( email === '' || password === '') {
         return res.status(401).send({message:'Please type required fields', error: 'input'})
       }
       try{

         const existingUser = await User.findOne({ email })
         if(!existingUser) {
           return res.status(401).send({message: 'No user found', error:'404 not found'})
         }
       
         const correctPassword = await bcrypt.compare(password, existingUser.password)
         if(!correctPassword) {
           return res.status(401).send({ message: 'Invalid credentials', error: 'invalid credentials'})
         }
         req.user.email = email        
         next()
       }catch (err) {
         console.log(err)
       }
}

exports.showGuestRegistration = (req, res, next) => {
   const user = req.user
  res.render('auth/user', {user})
}

exports.showConfirmation = (req, res) =>{
  const user = req.body
  res.render('includes/_userdata', {user})
}

exports.showConfirmationToPurchase = (req, res) => {
  const user = req.body
  res.render('includes/_userdata_to_purchase', {user})
}

exports.setConfirmMail = async (req, res, next) => {
   const user = await User.findOne({email: req.body.email})
   req.user = user
   console.log(user)
   req.authLink = 'http://localhost:3000/auth/email_confirmation'
   req.msg = 'This is message.'
   req.email_header ='Verification email'
   next()
}

exports.setConfirMailToPurchase = async (req, res, next) => {
  const user = await User.findOne({email: req.body.email})
  req.user = user
  console.log(user)
  req.authLink = 'http://localhost:3000/auth/email_confirmation/topurchase'
  req.msg = 'This is message.'
  req.email_header ='Verification email to process your shopping!!'
  next()
}

exports.showEmailSentPage = async (req, res) => {
  const user = req.user
  res.render('confirmations/email_sent', {user})
}

exports.showEmailSentPageToPurchase = async (req, res) => {
  const user = req.user
  res.render('confirmations/email_sent_to_purchase', {user})
}

exports.verifyUser = async (req, res, next) => {
  
  const params_token = req.params.token
  const cookie_token = req.cookies['token']
  console.log(cookie_token)
  const foundPToken = await Token.findOne({params_token})
  const foundCToken = await Token.findOne({cookie_token})
  if(!foundPToken || !foundCToken) return res.send('params_token not found')
  const user = await User.findOne({_id: foundPToken._userId})
  user.active = true
  user.save()
  req.route = 'regular'
  req.user = user
  next()
}

exports.verifyUserToPurchase = async (req, res, next) => {
  
  const params_token = req.params.token
  const cookie_token = req.cookies['token']
  console.log(cookie_token)
  const foundPToken = await Token.findOne({params_token})
  const foundCToken = await Token.findOne({cookie_token})
  if(!foundPToken || !foundCToken) return res.send('params_token not found')
  const user = await User.findOne({_id: foundPToken._userId})
  user.active = true
  user.save()
  req.user = user
  req.route = 'toPurchase'
  next()
}

exports.userLogout = (req, res) => {
  res.clearCookie('refresh_token')
  res.clearCookie('access_token')
  res.redirect('/')
}

exports.showResendEmailForm = (req, res) => {
  const user = req.user
  res.render('resend_form', {user})
}

exports.resendConfirmEmail = (req, res, next) => {
  const user = req.user
  user.email = req.body.email
  const msg = 'this is resent verification email'
  req.user = user
//create the resent page
  res.render('/resent', {user, email: req.body.email} )
}

exports.deleteUser = async (req, res, next) => {
  const email = req.body.email
  const registerData = await User.findOne({email})
  
  console.log(registerData)
  try{
    await registerData.delete()
    res.clearCookie('refresh_token')
    res.clearCookie('access_token')
    res.send('ok')
  }catch(e) {console.log(e)}
}

exports.showAccountInfo = async (req, res) => {
  const user = req.user
  const cart = await findCart(user)
  const orders = user.orders
  res.render('auth/user_account_page', {user, cart, orders})
}

exports.showModifyPage = (req, res) => {
  const user = req.user
  res.render('auth/acc_modify', {user})
}

exports.modifyUser = async (req, res) => {
  const {_id} = req.user
  const {username, email, password, via, citta, tel, cap} = req.body
  const updateValue = {username, email, password, via, citta, tel, cap}  
  const updatedUser = await User.findByIdAndUpdate(_id,
    { '$set': updateValue },
    { new: true, omitUndefined: true})
    res.render('auth/acc_modify', {user: updatedUser})
  }