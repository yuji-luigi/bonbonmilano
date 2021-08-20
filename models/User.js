const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  username:{
    type: String,
    required: [true, 'Name is required']
  },
  active: {
    type: Boolean,
    default: false
  },
  email: {
    type: String,
    required: [true, 'Email must be submited']
  },
  password: {
    type: String,
    min: [1, 'password must be longer than 0'],
    max: [15, 'password must be shorter than 16']
  },
  guest: {
    type:Boolean,
    default: false
  },
  via: String,
  citta: String,
  cap: Number,
  tel: Number,
  orders:[]
})

module.exports = mongoose.model('User', userSchema)