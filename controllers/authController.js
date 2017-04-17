var passport = require('../config/passport')

var Usermodel = require('../models/user').Model

function displaySignup (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/profile')
  }
  res.render('restricted/signup')
}

function authSignup (req, res, done) {
  console.log('running authSignup!')
  passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/failed'
  })
}

function displayLogin (req, res) {
  if (req.isAuthenticated()) {
    return res.redirect('/profile')
  }
  res.render('restricted/login')
}

function authLogin (req, res) {

}

// function userPage (req, res) {
//   UserModel.findOne({username: req.params.user}, function (err, user) {
//     if (err) console.error(err)
//     console.log(user + ' is found in db')
//     res.render('restricted/userpage', {user: user})
//   })
// }

module.exports = {
  displaySignup: displaySignup,
  authSignup: authSignup,
  displayLogin: displayLogin,
  authLogin: authLogin
}
