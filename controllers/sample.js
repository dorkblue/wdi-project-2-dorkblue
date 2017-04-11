var router = require('express').Router()

router.get('/', function (req, res, next) {
  res.render('homepage')
})

router.get('/about', function (req, res, next) {
  res.render('about')
})

router.get('/faq', function (req, res, next) {
  res.render('faq')
})


module.exports = router
