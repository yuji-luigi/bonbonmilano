const jwt = require('jsonwebtoken')
const User = require('../models/User')

const KEY_ACCESS = process.env.JWT_ACCESS
const KEY_REFRESH = process.env.JWT_REFRESH

module.exports = async (req, res, next) => {
  const bearerRefresh = req.cookies['refresh_token']
  let bearerAccess = req.cookies['access_token']
  console.log(`cookiehandler, ref:${bearerRefresh}, access:${bearerAccess}`)
  const  isGuest = checkIfGuest(bearerRefresh, bearerAccess)
  if(isGuest){
    req.guest = true
    req.user = {guest: true, _id: req.cookies['device'] }
    return next()
  }
  const verifiedDataAccessToken = verifyToken(bearerAccess, KEY_ACCESS)
  if (verifiedDataAccessToken.message === 'jwt expired' 
  || verifiedDataAccessToken === false) {
    res.clearCookie('access_token')
    const verifiedDataRefresh = verifyToken(bearerRefresh, KEY_REFRESH)
    if (verifiedDataRefresh){
      const email = verifiedDataRefresh
      const user = await User.findOne({email})
      if(!user || user === null || user === undefined){
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
        return next()
        // return res.redirect('/')
      } 
      bearerAccess = genNewAccessToken(email, KEY_ACCESS)
      res.cookie('access_token', bearerAccess, { httpOnly: true })
      req.user = user
      req.user.guest = false
      return next() 
    } else res.status(401).send({message})
  }
  if (verifiedDataAccessToken) {
    const {email} = verifiedDataAccessToken
    let user = await User.findOne({email})
    if (user === null) {
        console.log('user = ',user)
        res.clearCookie('refresh_token')
        res.clearCookie('access_token')
        return res.redirect('/')
      }
    req.user = user
    req.user.guest = false

    return next() 
  }
} 


const genNewAccessToken = (data, key) => {
  let token = jwt.sign({ email:data }, key, {expiresIn: '30s'})
  token = 'Bearer ' + token
  return token
}

let checkIfGuest = (refToken, acToken) => {
  if(typeof refToken ==='undefined' 
    && typeof acToken === 'undefined'){
      return true
    } else {
      return false
    }
}
  const verifyToken = (bearerToken, key) => {
    if(typeof bearerToken !=='undefined' || typeof bearerToken !=='null'){
      const token = bearerToken.split(' ')[1]
   return jwt.verify(token, key, (err, email) => {
      if(err)return err
      if(email)return email
    })
  } else return false
}