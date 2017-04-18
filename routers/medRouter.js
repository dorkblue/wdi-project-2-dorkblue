var router = require('express').Router()
var medController = require('../controllers/medController')

router.use('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send('patientRouter: you\'re not fucking logged in')
  }
  next()
})

// /* route '/new' */
// // create new patient page
router.get('/new', medController.toCreateNew)
// edit patient page
router.get('/edit', medController.showEdit)

router.route('/')
.get(medController.index)
.post(medController.new)

/* route '/:patient_id' */
router.route('/:id')
// get : show one patient
.get(medController.one)
// // put : receive req to process edit
.put(medController.edit)
// // delete: receive req to process delete
.delete(medController.remove)

module.exports = router
