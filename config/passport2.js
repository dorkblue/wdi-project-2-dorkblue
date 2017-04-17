var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var Business = require('../models/business')
var Businessmodel = Business.Model

// set the authenticated user data into session
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
  Businessmodel.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, givenEmail, givenPassword, next) {
  var newUser = new Businessmodel({
    email: givenEmail,
    name: req.body.name,
    password: givenPassword
  })

  newUser.save(function (err, data) {
    if (err) {
      req.flash('error', 'Registration failed')
      return next(err)
    }

    next(null, data)
  })
}
))

module.exports = passport
