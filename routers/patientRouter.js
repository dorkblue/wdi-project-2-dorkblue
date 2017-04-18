var router = require('express').Router()
var patientController = require('../controllers/patientController')

// check if user is authenticated
router.use('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send('patientRouter: you\'re not fucking logged in')
  }
  next()
})

// jqueryui autocomplete search bar
router.get('/search', patientController.search)

/* route '/new' */
// create new patient page
router.get('/new', patientController.toCreateNew)
// edit patient page
router.get('/edit', patientController.showEdit)

/* route '/' */
router.route('/')
// get '/' : show all patient
.get(patientController.index)
// post '/' : create new patient
.post(patientController.new)

/* route '/:patient_id' */
router.route('/:id')
// get : show one patient
.get(patientController.one)
// put : receive req to process edit
.put(patientController.edit)
// delete: receive req to process delete
.delete(patientController.remove)

module.exports = router
