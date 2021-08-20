const jwt = require('jsonwebtoken')
const User = require('../models/User')
const fs = require('fs')

const logger = async (req, res, next) => {
  const {email} = req.user
  let accessToken = jwt.sign({ email }, process.env.JWT_ACCESS, { expiresIn: '30s' })
  let refreshToken = jwt.sign(email, process.env.JWT_REFRESH)
  accessToken = 'Bearer ' + accessToken
  refreshToken = 'Bearer ' + refreshToken
  res.clearCookie('refresh_token')
  res.clearCookie('access_token')
  res.cookie('refresh_token',
    refreshToken,
    { httpOnly: true })
  res.cookie('access_token',
    accessToken,
    { httpOnly: true })
    let route
    if(req.route){
      route = req.route
      switch (route){
        case 'toPurchase': return res.redirect('/cart/purchase')
        break
        case 'regular' : return res.redirect('/')
  
        default: res.json('ok')
      }
    }
    res.json('ok')
    
}

module.exports = logger