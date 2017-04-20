var router = require('express').Router()
var userController = require('../controllers/userController')
var cusFn = require('../public/js/modules')

router.use('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send('Please login')
  } else if (!cusFn.isAdmin(req.user)) {
    return res.redirect('/')
  }
  next()
})

router.route('/')
.get(userController.index)
.post(userController.new)

router.route('/new')
.get(userController.createNewPage)

router.route('/:id')
.get(userController.one)
.put(userController.edit)
.delete(userController.remove)

module.exports = router
