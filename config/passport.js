var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy

var Usermodel = require('../models/test').Model

// set the authenticated user data into session
passport.serializeUser(function (user, done) {
  done(null, user.id)
})

/*
 * Passport "deserializes" objects by taking the user's serialization (id)
 * and looking it up in the database
 */
passport.deserializeUser(function (id, done) {
  Usermodel.findById(id, function (err, user) {
    done(err, user)
  })
})

passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
}, function (req, givenUser, givenPassword, done) {
  console.log('req in passport.use', req)
  console.log('req.body in passport.use', req.body)
  var newUser = new Usermodel({
    email: req.body.email,
    username: givenUser,
    password: givenPassword
  })
  newUser.save(function (err, data) {
    if (err) {
      console.log('NEW USER SAVE ERROR', err)
      return done(err)
    }
    done(null, data)
  })
}))

passport.use('local-login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
}, function (givenUser, givenPassword, done) {
  Usermodel.findOne({ username: givenUser }, function (err, foundUser) {
    if (err) return done(err)
    // If no user is found
    if (!foundUser) return done(null, false)
    // Check if the password is correct
    if (!foundUser.validPassword(givenPassword)) return done(null, false)

    return done(null, foundUser)
  })
}))

module.exports = passport
