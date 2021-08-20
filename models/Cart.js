const mongoose = require('mongoose')

const cartSchema = mongoose.Schema(
  {
    user:{
      type: mongoose.Types.ObjectId,
      ref:'User'
    },
    guest_id: String
    ,
    items: [
      {
        product_id:{
          type: mongoose.Types.ObjectId,
          required: true
        },
        product_name: {
          type: String,
          required: true
        },
        img: {
          type: String,
          required: true,
        },
        ref_title: {
          type: String,
          required: true
        }, 
        price: {
          type: Number,
          required: true
        },
        quantity:{
          type: Number,
          min: 0
        },
        sub_total: {
          type: Number
        },
        party_details: {
          name: String,
          via: String,
          citta: String,
          cap: Number,
          name_person: String,
          gender: String,
        }  
      }
    ],
    total: {
      type: Number
    }
  })
  

  module.exports = mongoose.model('Cart', cartSchema)