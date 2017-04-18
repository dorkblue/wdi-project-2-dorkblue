var router = require('express').Router()
var consultController = require('../controllers/consultController')

/* route '/new' */
// create new consultation page
router.get('/new', consultController.toCreateNew)
// // edit consultation page
router.get('/edit', consultController.showEdit)

/* route '/' */
router.route('/')
// get '/' : show all consultation
.get(consultController.index)
// post '/' : create new consultation
.post(consultController.new)

/* route '/:consult_id' */
router.route('/:id')
// get : show one consultation
.get(consultController.one)
// // put : receive req to process edit
.put(consultController.edit)
.delete(consultController.remove)

module.exports = router
