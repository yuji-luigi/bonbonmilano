const User = require('../models/User')
const Cart = require('../models/Cart')

exports.showIndexPage = async (req, res) => {
  const user = req.user
  const accounts = await User.find()
  res.render('admin/index', {accounts, user})
}

exports.deleteAccount = async (req, res) => {
  const _id = req.params.id
  try{
    await Cart.findOneAndRemove({user: _id})
    await User.findByIdAndRemove({_id})
    res.redirect('/admin')
} catch(e) {console.log(e)}
}