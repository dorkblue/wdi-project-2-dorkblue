var router = require('express').Router()
var passport = require('../config/passport')
var authController = require('../controllers/authController')

router.route('/loggedin')
.get((req, res) => {
  console.log('logged in', req.user)
  if (req.user.type === 'admin') {
    res.redirect('/users')
  } else {
    res.redirect('/patient')
  }
})

router.route('/')
.get(authController.displayLogin)
// POST / page to create new user
.post(authController.authLogin)

router.route('/logout')
.get(authController.logOut)

module.exports = router
