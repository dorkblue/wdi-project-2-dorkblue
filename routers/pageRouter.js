var router = require('express').Router()
var pageController = require('../controllers/pageController')

router.route('/')
// GET / page
.get(pageController.showHome)

module.exports = router
