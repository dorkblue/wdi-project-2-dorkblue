var passport = require('../config/passport')
var cusFn = require('../public/js/modules')

function displayLogin (req, res) {
  if (req.isAuthenticated()) {
    if (req.user.type === 'admin') {
      return res.redirect('/users')
    } else {
      return res.redirect('/patient')
    }
  }
  res.render('auth/login')
}

function authLogin (req, res) {
  passport.authenticate('local-login', {
    successRedirect: '/loggedin',
    failureRedirect: '/'
  })(req, res)
}

function logOut (req, res) {
  console.log('logout passport user', req.user)
  req.logout()
  // redirect to a logout page, with options to login
  res.redirect('/')
}

module.exports = {
  displayLogin: displayLogin,
  authLogin: authLogin,
  logOut: logOut
}
