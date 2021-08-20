const Product = require('../models/Product')

exports.showShopPage = async (req, res) =>{
 try{
   const products = await Product.find()
   const user = req.user
   const guest = req.guest
   res.render('shop/shop', {products, guest, user})
 }catch (e) {console.log(e)}
}

exports.showOptions = async (req, res) => {
  const title = req.params.title
  const product = await Product.findOne({title})
  res.render('shop/ajax_product_options', {product})
}

exports.showProductDetails = async (req, res) => {
  const user = req.user
  const guest = req.guest
  const id = req.params.id
  const title = req.params.title
  const products = await Product.aggregate(
    [{$match : {title}},
      {$unwind : "$variations"}])
  const product = products.find(({variations}) => variations._id == id)
  res.render('shop/product', {product: product.variations, guest, user, ref_title: title})
}