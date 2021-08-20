const mongoose = require('mongoose')


const tokenSchema = mongoose.Schema({
  _userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
  params_token: { type: String, required: true },
  cookie_token: { type: String, required: true },
  expireAt: { type: Date, default: Date.now, index: { expires: 1800000 } }
});

module.exports =  mongoose.model('Token', tokenSchema)
