var router = require('express').Router()
var consultController = require('../controllers/consultController')

/* route '/new' */
// create new consultation page
router.get('/new', consultController.toCreateNew)
// // edit consultation page
// router.get('/:consult_id/edit', (req, res) => {
//   res.send('edit consultation info page')
// })

/* route '/' */
router.route('/')
// get '/' : show all consultation
.get(consultController.index)
// post '/' : create new consultation
.post(consultController.new)

// /* route '/:consult_id' */
// router.route('/:consult_id')
// // get : show one consultation
// .get(consultController.one)
// // put : receive req to process edit
// .put((req, res) => {
//   res.send('receive put req to edit')
// })

module.exports = router
