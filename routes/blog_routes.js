const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
  const user = req.user
  res.render('blog/blog_index', {user})
})

router.get('/content', (req, res) => {
  const user = req.user
  res.render('blog/blog_content', {user})
})

module.exports = router