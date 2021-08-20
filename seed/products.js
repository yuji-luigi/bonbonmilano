const mongoose = require('mongoose')
const Product = require('../models/Product').productSchema



const products = [
  {
    title: 'Bomboniere',
    mainimgurl: '/images/bonboniere2.jpg',
    variations: [
      {
        varititle: 'Bomboniere di Gomma',
        material: 'gomma',
        variimgurl:'/images/bonboniere2.jpg',
        detailimgurl:[
          '/images/bonboniere3.jpg',
          '/images/bonboniere5.jpg',
          '/images/bonboniere2.jpg',
          '/images/bonboniere4.jpg'
        ],
        description: 'description 1',
        price: 3000
      }
    ,
      {
        varititle: 'Bomboniere di Plastica',
        material: 'plastic',
        variimgurl:'/images/bonboniere4.jpg',
        detailimgurl:[
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg'
        ],
        description: 'description 1',
        price: 3000
      },
      {
        varititle: 'Diet Coke',
        material: 'Diet Coke',
        variimgurl:'/images/bonboniere3.jpg',
        detailimgurl:[
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg',
          '/images/bonboniere6.jpg'
        ],
        description: 'description 1',
        price: 3000
      }
    ]
    },
  {
  title: 'Partecipazioni',
  mainimgurl: '/images/bomboniere1.jpg',
  variations: [
    {
      varititle: 'Partecipazioni di Gomma',
      material: 'gomma',
      variimgurl:'/images/bonboniere6.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'Partecipazioni di Plastica',
      material: 'plastic',
      variimgurl:'/images/bonboniere4.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'Diet Coke',
      material: 'Diet Coke',
      variimgurl:'/images/bonboniere3.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
  ]
},
{
  title: 'Busta Paga',
  mainimgurl: '/images/bonboniere3.jpg',
  variations: [
    {
      varititle: 'Busta paga di carta',
      material: 'paper',
      variimgurl:'/images/bonboniere4.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'Busta paga di legno',
      material: 'wood',
      variimgurl:'/images/bonboniere2.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'Bustapaga PINK',
      material: 'Pink',
      variimgurl:'/images/bonboniere3.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
  ]
},
{
  title: 'Bomber Man',
  mainimgurl: '/images/bonboniere4.jpg',
  variations: [
    {
      varititle: 'BomberMan White',
      material: 'White',
      variimgurl:'/images/bonboniere3.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'Bomberman Fire',
      material: 'Fire',
      variimgurl:'/images/bomboniere1.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
    {
      varititle: 'luuui',
      material: 'LUUI',
      variimgurl:'/images/bomboniere1.jpg',
      detailimgurl:[
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg',
        '/images/bonboniere6.jpg'
      ],
      description: 'description 1',
      price: 3000
    },
  ]
}
]

const seedProducts = () => {
  products.forEach(product => {
    Product.create(product, (err, createdProduct) => {
      if (err){
        console.log(err)
      } else {
        console.log('Product saved')
        createdProduct.save()
      }
    })
  })
}

module.exports = seedProducts