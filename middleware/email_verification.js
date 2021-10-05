/* i put 2 tokens in mail auth process, one is in cookie, the other is in
   req.params. As a result clients can auth them only by the same device which has 
   been used to register.
   I should switch to one token auth. But here I leave it like this. */

const nodemailer = require("nodemailer");
const { google, GoogleApis } = require("googleapis");
const CLIENT_ID =
  "933856054869-6lpj1bacbj55oaffc08oouk758evqlel.apps.googleusercontent.com";
const CLIENT_SECRET = "KlLk5Y8XCFUIHcSboVEfnfd4";
const REDIRECT_URL = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN =
  "1//04EYq010frNVACgYIARAAGAQSNwF-L9IrqjMj5WgwJfF-3OVD3afgVd8a_OBTn9lSSWoHv4yqFsPwBVLjN8qa8ljU29IKoMcf1zA";
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URL
);
oAuth2Client.setCredentials({ refreshToken: REFRESH_TOKEN });

const Token = require("../models/Token");
const User = require("../models/User");
const crypto = require("crypto");

const sendVerifyEmail = async (req, res, next) => {
  try {
    const oAuthAceesToken = await oAuth2Client.getAccessToken();
    const { username, email, cap, tel, via, citta, _id } = req.user;
    let authLinkHost = req.authLinkHost;
    if (process.env.NODE_ENV !== "production") {
      authLinkHost = "http://localhost:4242";
    }
    const authLink = req.authLink;
    const msg = req.msg;
    const email_header = req.email_header;
    console.log(authLinkHost);
    res.clearCookie("token");
    await Token.deleteOne({ _userId: _id });

    const tokenSchema = new Token({
      _userId: _id,
      params_token: crypto.randomBytes(16).toString("hex"),
      cookie_token: crypto.randomBytes(16).toString("hex"),
    });
    tokenSchema.save();
    const { params_token, cookie_token } = tokenSchema;
    res.cookie("token", cookie_token, { maxAge: 180000 });

    console.log(`params_token: ${params_token}, cookie_token: ${cookie_token}`);

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
  <h1><a href="${authLinkHost}${authLink}/${params_token}/">Click here to authenticate your account</a></h1>
  
  `;

    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_ADDRESS,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },

      // host: "smtp.gmail.com",
      // port: 587,
      // secure: false, // true for 465, false for other ports
      // auth: {
      //   user: process.env.EMAIL_ADDRESS, // generated ethereal user
      //   pass: process.env.EMAIL_PASS, // generated ethereal password
      // },
      // tls: {
      //   rejectUnauthorized: false,
      // },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Bonbonmilano customer service" <yujitest@test.com>', // sender address
      to: email, // list of receivers
      subject: "Completa il registrazione", // Subject line
      text: "Hello world?", // plain text body
      html: output, // html body
    });

    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    res.json("Email has been sent");
  } catch (e) {
    console.log(e);
    const user = await User.findOne({ email: req.user.email });
    const token = await Token.findOne({ _userId: user._id });
    await token.delete(() => console.log("token has been deleted"));
    await user.delete(() => console.log("user has been deleted"));
    res.json({ message: "email error" + e });
  }
};

module.exports.sendVerifyEmail = sendVerifyEmail;
