var router = require('express').Router()
var passport = require('../config/passport')
var authController = require('../controllers/authController')

router.route('/signup')
.get(authController.displaySignup)
.post(passport.authenticate('local-signup', {
  successRedirect: '/profile',
  failureRedirect: '/failed'
}))

router.route('/login')
.get(authController.displayLogin)
// POST / page to create new user
.post(passport.authenticate('local-login', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}))
//
// router.route('/:user')
// // GET /:user page
// .get(pageController.userPage)

router.route('/profile')
.get((req, res) => {
  console.log(req.session.passport)
  res.render('testing', {sess: req.session.passport})
})

router.route('/failed')
.get((req, res) => {
  res.send('failed')
})

router.route('/logout')
.get((req, res) => {
  console.log('logout passport user', req.user)
  req.logout()
  res.redirect('/signup')
})

module.exports = router
