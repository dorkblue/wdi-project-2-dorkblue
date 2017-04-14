var router = require('express').Router()


/* route '/new' */
// create new page
router.get('/new', (req, res) => {
  res.send('create new patient page here')
})
// edit patient page
router.get('/:patient_id/edit', (req, res) => {
  res.send('edit patient info page')
})

// get '/' : show all patient
.get((req, res) => {
  res.send('show all patient here')
})
// post '/' : create new patient
.post((req, res) => {
  res.send('receive req to create new patient')
})

/* route '/' */
router.route('/')
// get '/' : show all patient
.get((req, res) => {
  res.send('show all patient here')
})
// post '/' : create new patient
.post((req, res) => {
  res.send('receive req to create new patient')
})

/* route '/:patient_id' */
router.route('/:patient_id')
// get : show one patient
.get((req, res) => {
  res.send('show patient info here')
})
// put : receive req to process edit
.put((req, res) => {
  res.send('receive put req to edit')
})

module.exports = router
