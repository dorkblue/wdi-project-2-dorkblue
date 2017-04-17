var router = require('express').Router()
var patientController = require('../controllers/patientController')

router.get('/search', patientController.search)

router.use('/', (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.send('patientRouter: you\'re not fucking logged in')
  }
  next()
})

/* route '/new' */
// create new patient page
router.get('/new', patientController.toCreateNew)
// edit patient page
router.get('/:patient_id/edit', (req, res) => {
  res.send('edit patient info page')
})

/* route '/' */
router.route('/')
// get '/' : show all patient
.get(patientController.index)
// post '/' : create new patient
.post(patientController.new)

/* route '/:patient_id' */
router.route('/:patient_id')
// get : show one patient
.get(patientController.one)
// put : receive req to process edit
.put((req, res) => {
  res.send('receive put req to edit')
})

module.exports = router
