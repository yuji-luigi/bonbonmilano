const Cart = require('../models/Cart')
const Product = require('../models/Product')
const stripe = require('stripe')(process.env.STRIPE_SK)


//Refactor along w/func updateCartItemsArray
exports.addToCart =  async (req,res) => {
  const user = req.user
  const { quantity, product_id, ref_title } = req.body
  const product = await findProduct(ref_title, product_id)
  const price = product.price
  const img = product.variimgurl
  const product_name = product.varititle
  const item = { quantity, product_id, ref_title, price, product_name, img }  
  try {
    let foundCart = await findCart(user)
    if(foundCart){
      const arrayOfProductIds = foundCart.items.map((item) => item.product_id + '')
      if (arrayOfProductIds.includes(item.product_id)) {
       let updatedCart = await updateCartItemsArray(user, product_id, quantity)
        await setTotalPrice(updatedCart)
        return res.sendStatus(200)
      }
      foundCart.items.push(item)
     const updatedCart = await foundCart.save()
     await setTotalPrice(updatedCart)
      return res.sendStatus(200)

    }
    const cart = await Cart.create({ user, items: [item]})
    await setTotalPrice(cart)
    return res.sendStatus(200)
  } catch(e){console.error(e)}
}

exports.showParselRegistration = (req, res) => {
  const user = req.user
  const product_id = req.params.id
  res.render('auth/party_place',{user, product_id})
}

exports.showConfirmation = async (req, res) => {
  const user = req.user
  const cart = await findCart(user)
  const [item] = cart.items.filter(item=> item.product_id == req.params.id)
  res.render('confirmations/party_address', {user, detail : item.party_details} )
}


exports.showCart = async (req, res) => {
  const user = req.user
  let cart = await findCart(user)
  if(!cart){
    cart = new Cart({items:[]})
   console.log(cart.items.length)
  }
  res.render('cart/cart', {user, cart })
}

exports.deleteOneItem = async (req, res) => {
  const user = req.user
  try {
   const cart = await findCart(user)
   await cart.updateOne({"$pull": {
            "items": { "product_id" :req.params.id}
          }},{safe: true, multi: true, new: true})
    const newCart = await findCart(user)
          setTotalPrice(newCart)
} catch(err) {console.log(err)}
  res.redirect('/cart')
}

exports.registerParcelDetails = async (req, res) => {
  const user = req.user
  const product_id = req.params.id

  if(user.guest === true){
    try{
      const cart = await Cart.findOneAndUpdate(
        {guest_id: user._id, 
          "items.product_id": product_id},
        {
          "items.$.party_details": req.body,
        }, {upsert: true})
        return res.json({message:'okay'})
      } catch(err) { 
        console.error(err)
        return res.json({message: 'Please check the forms. Something is not correct', error: err})}
  }
  try{
    const cart = await Cart.findOneAndUpdate(
      {user, 
        "items.product_id": product_id},
      {
        "items.$.party_details": req.body,
      }, {upsert: true})
      return res.json({message:'okay'})
    } catch(err) { 
      console.error(err)
      return res.json({message: 'Please check the forms. Something is not correct', error: err})}
  }

exports.getOneItemFromCart = async (req, res, next) => {
  const user = req.user
  const cart = await findCart(user)
  const [cartOneItem] = cart.items.filter(item=> item.product_id == req.params.id)
  const products = await Product.findOne({title: cartOneItem.ref_title})
  const [product] = products.variations.filter(variation => variation._id.toString() == cartOneItem.product_id.toString())
  req.product = product
  req.cartOneItem = cartOneItem
  next()
}

exports.showProductAndParselDetails = async (req, res) => {
   const {product, user, cartOneItem} = req
  res.render('cart/product_details', {user, info: cartOneItem, product})
}

exports.showPartyInfoModifyPage = async (req, res) => {
  const {product, user, cartOneItem} = req
  res.render('cart/modify_party', {user, info: cartOneItem, product})
}

exports.modifyPartyInfo = async (req, res) => {
  const {user, cartOneItem, product} = req
  const product_id = req.params.id
  const {party_details} = cartOneItem
  const { name, via, citta, cap, name_person, gender} = req.body
  const request = { name, via, citta, cap, name_person, gender}
  const updateValue = handleEmptyField(request, party_details)


  if(user.guest === true){
    try{
      const cart = await Cart.findOneAndUpdate(
        {guest_id: user._id, 
          "items.product_id": product_id},
        {
          "items.$.party_details": updateValue,
        }, {new: true, upsert: true})
        return res.render('cart/modify_party')
      } catch(err) { console.error(err)
        return res.json({message: 'Please check the forms. Something is not correct', err})}
  }
  try{
    const cart = await Cart.findOneAndUpdate(
      {user, 
        "items.product_id": product_id},
      {
        "items.$.party_details": updateValue,
      }, {new: true, upsert: true})
      const [updatedItem] = cart.items.filter(item => item.product_id == product_id )
      console.log(updatedItem)
      return res.render('cart/modify_party', {user, product, info: updatedItem })
    } catch(err) {return res.json({message: 'Please check the forms. Something is not correct'})}
 
  
}

const handleEmptyField =(obj, party_details) => {
  const filter = {}
  for (let key in obj) {
  if(obj[key] === undefined) {
    filter[key] = party_details[key]
  } else {
    filter[key] = obj[key]
  }
}
return filter
}

exports.addressConfirmed = (req, res) => {
  const user = req.user
  res.render('confirmations/bounce_page',{user})
}

exports.showPurchaseBill = async (req, res) => {
  const user = req.user
  try{
     await Cart.findOneAndUpdate(
      {guest_id: req.cookies['device']},
      { user, "$unset":{"guest_id": ""}},
       {new:true})
    const cart = await findCart(user)
       res.render('confirmations/purchase_bill', {user, cart})
  }catch(e) {console.log(e)}
}

const getLineItems = (items) => {
  const line_items = []
  items.forEach(item => {
    const line_item = {
      price_data: {
          currency: 'eur',
          product_data: {
            name: item.product_name,
          },
          unit_amount: item.price,
        },
        quantity: item.quantity,
      }
      line_items.push(line_item)
  })
  return line_items
}

exports.createCheckoutSession = async (req, res) => {
  const user = req.user
  try{
    const cart = await findCart(user)
    const {items} = cart
    const line_items = getLineItems(items)   
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: 'http://localhost:3000/cart/payment.success',
      cancel_url: 'http://localhost:3000/cart/payment.cancel',
    });
    res.redirect(303, session.url);
  }catch(err) {console.log(err)}

}

exports.pushOrderinDB = async (req, res, next) => {
  const user = req.user
  const timeStamp = getDate()
  try{
    const cart = await findCart(user)
    const {items} = cart
    const details =[]
    let orderData = { timeStamp, total: cart.total, details }
    setDetails(items, details)
    user.orders.push(orderData)
    await user.save((err, doc) => {
      if(doc) next()
    })
  }catch(e) {console.log(e)}
}

const getDate = () => {
  const event = new Date(Date.now())
  const timeStamp = event.toDateString()
  return timeStamp
}

const setDetails = (items, details) => {
  items.forEach(item => {
    itemData = {
      name: item.product_name,
      price: item.price,
      qty: item.quantity,
      party_details: item.party_details
      }
      details.push(itemData)
  })
}

exports.paymentSuccess = async (req, res) => {
  console.log('Payment success!!')
  const user = req.user
  const cart = await findCart(user)

  res.render('confirmations/checkout_success', {user})
}

exports.deleteAllCartItems = async (req, res, next) => {
  const user = req.user
  const cart = await findCart(user)
  await cart.updateOne({'$unset':{ 'items':'' }} )
  const emptyCart = await findCart(user)
  await setTotalPrice(emptyCart)
  next()
}

exports.paymentCancel = (req, res) => {
  const user = req.user
  res.render('confirmations/checkout_canceled', {user})
}



const reducer = (accumulator, currentValue) => accumulator + currentValue

const findCart = async (user) => {
  let cart
  if(user.guest === true) {
    cart = await Cart.findOne({guest_id: user._id})
    if(!cart){
      cart = await Cart.create({ guest_id: user._id})
    }
    return cart
  }
  cart = await Cart.findOne({user})
  return cart
}

//Refactor
const updateCartItemsArray = async (user, product_id, quantity) => {
  let updatedCart
  if(user.guest === true) {
    updatedCart = await updateCartItemsArrayGuest(user, product_id, quantity)
    return updatedCart
  }
  updatedCart = await updateCartItemsArrayUser(user, product_id, quantity)
  return updatedCart
}

//Refactor!
const updateCartItemsArrayGuest = async (user, product_id, quantity) => {
  const updatedCart = await Cart.findOneAndUpdate(
    {guest_id: user._id, 'items.product_id': product_id},
    {
      $inc: {'items.$.quantity': quantity}
    }
  ,{new: true})
  return updatedCart
}
//Refactor!!
const updateCartItemsArrayUser = async (user, product_id, quantity) => {
  const updatedCart = await Cart.findOneAndUpdate(
    {
      user, 'items.product_id': product_id},
    {
      $inc: {'items.$.quantity': quantity}
    }
  ,{new: true})
  console.log(updatedCart)
  return updatedCart
}

const findProduct = async (ref_title, id) => {
  const products = await Product.findOne({title: ref_title})
  const [product] = products.variations
  .filter(variation => variation._id.toString() == id.toString())
  return product
}

const getSubTotals = (cart) => {
  let subTotals = []
      cart.items.forEach(item => {
        const subTotal = item.price * item.quantity
        subTotals.push(subTotal)
      })
      return subTotals
}

const setTotalPrice = async (cart) => {
  try{
    if(cart.items.length === 0) {
      cart.total = 0
    }else{
      const subTotals = getSubTotals(cart)
      const total = subTotals.reduce(reducer)
      cart.total = total
    }
    await cart.save()
  }catch(err) {console.log(err)}
}

module.exports.findCart = findCart