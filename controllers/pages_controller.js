// // RESTFULL ROUTES
// CREATE FORM   => GET => /movies/new
// EDIT FORM     => GET => /movies/:id
//
// INDEX         => GET => /movies
// CREATE        => POST => /movies
// SHOW          => GET => /movies/:id
// UPDATE        => PUT => /movies/:id
// DELETE        => DELETE => /movies/:id

var router = require('express').Router()
var User = require('../models/User')

// GET / page
router.get('/', function (req, res, next) {
  return res.render('unrestricted/homepage')
})
// POST / page
router.post('/', function (req, res, next) {
  var newUser = new User()
  newUser.username = req.body.username
  newUser.email = req.body.email
  newUser.password = req.body.password

  newUser.save(function (err, newuser) {
    if (err) next()
    // console.log('new user saved!')
    console.log(newuser)
    res.redirect('/' + newUser.username)
  })
})

// GET /:user page
router.get('/:user', function (req, res, next) {
  // console.log('finding user ' + req.params.user)
  User.findOne({username: req.params.user}, function (err, user) {
    if (err) next()
    console.log('user found!')
    res.render('restricted/userpage', {user: user})
  })
})

// // GET /about page
// router.get('/about', function (req, res, next) {
//   res.render('about')
// })
//
// // GET /faq page
// router.get('/faq', function (req, res, next) {
//   res.render('faq')
// })

module.exports = router
