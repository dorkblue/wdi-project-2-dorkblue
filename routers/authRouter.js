var router = require('express').Router()
var passport = require('../config/passport')
var authController = require('../controllers/authController')

router.route('/failed')
.get((req, res) => {
  res.send('failed')
})

router.route('/signup')
.get(authController.displaySignup)
.post(authController.authSignup)

router.route('/login')
.get(authController.displayLogin)
// POST / page to create new user
.post(authController.authLogin)
//
// router.route('/:user')
// // GET /:user page
// .get(pageController.userPage)

router.route('/profile')
.get((req, res) => {
  res.render('testing', {USER: req.user.username})
})



router.route('/logout')
.get(authController.logOut)

module.exports = router
