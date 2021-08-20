const nodemailer = require('nodemailer')
const Token = require('../models/Token')
const User = require('../models/User')
const crypto = require('crypto')

const sendVerifyEmail = async (req, res, next) => {
try{
  const {username, email, cap, tel, via, citta, _id} = req.user
  const authLink = req.authLink
  const msg = req.msg
  const email_header = req.email_header
  

  res.clearCookie('token')
  await Token.deleteOne({_userId: _id})

  const tokenSchema = new Token(
    {
      _userId: _id,
      params_token: crypto.randomBytes(16).toString('hex'),
      cookie_token: crypto.randomBytes(16).toString('hex')
    })
  tokenSchema.save()
  const {params_token, cookie_token} = tokenSchema
  res.cookie('token', cookie_token, {maxAge: 180000})

  console.log(`params_token: ${params_token}, cookie_token: ${cookie_token}`)
  
  
    const output = `
  <p>${email_header}</p>
  <p>${msg}</p>
  <ul>
    <li>Name: ${username}
    <li>Company: ${via}</li>
    <li>Company: ${citta}</li>
    <li>Company: ${cap}</li>
    <li>email: ${email}</li>
    <li>Phone: ${tel}</li>
  <h1><a href="${authLink}/${params_token}/">Click here to authenticate your account</a></h1>
  `
  
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'yujitest777@gmail.com', // generated ethereal user
      pass: proccess.env.EMAIL_PASS, // generated ethereal password
    },
    tls: {
      rejectUnauthorized: false
    }
  });
  
  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Nodemailer contact 👻" <yujitest@test.com>', // sender address
    to: email, // list of receivers
    subject: "Node contact request ✔", // Subject line
    text: "Hello world?", // plain text body
    html: output, // html body
  });
  
  console.log("Message sent: %s", info.messageId);
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  res.json('Email has been sent')
  }catch(e) {
    console.log(e)
    const user = await User.findOne({email: req.user.email})
    const token = await Token.findOne({_userId: user._id})
    await token.delete(()=>console.log('token has been deleted'))
    await user.delete(() => console.log('user has been deleted'))
    res.json({message:'email error', error: e})
  }
}

module.exports.sendVerifyEmail = sendVerifyEmail
