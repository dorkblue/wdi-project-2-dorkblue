var router = require('express').Router()
var User = require('../models/User')

// GET / page
router.route('/')
.get(function (req, res, next) {
  return res.render('unrestricted/homepage')
})
// POST / page to create new user
.post(function (req, res, next) {
  var newUser = new User()
  newUser.username = req.body.username
  newUser.email = req.body.email
  newUser.password = req.body.password

  newUser.save(function (err, newuser) {
    if (err) next()
    // console.log('new user saved!')
    console.log(newuser + ' is saved!')
    res.redirect('/' + newUser.username)
  })
})
// GET /:user page
router.route('/:user')
.get(function (req, res, next) {
  // console.log('finding user ' + req.params.user)
  console.log(req.params)
  User.findOne({username: req.params.user}, function (err, user) {
    if (err) next()
    console.log(user + ' is found in db')
    res.render('restricted/userpage', {user: user})
  })
})
