const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
  {
    title:{
      type: String,
      required: true
    },
    mainimgurl: {
      type: String,
      required: true,
    },
    variations: [
      {
        varititle:{
          type: String,
          required: true
        },
        material:{
          type: String,
          required: true
        },
        variimgurl: {
          type: String,
          required: true
        },
        detailimgurl: {
          type: Array,
          required: true
        },
        description: {
          type: String,
          required: true
        },
        price: {
          type: Number,
          required: true
        },
        
      }
    ]
  })

  module.exports = mongoose.model('Product', productSchema)
