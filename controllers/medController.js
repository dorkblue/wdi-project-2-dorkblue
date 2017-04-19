var Med = require('../models/Medicine')
var Medmodel = Med.Model
var medObj = Med.obj
var cusFn = require('../public/js/modules')

function showAll (req, res, next) {
  var thead = cusFn.filterKeys(Object.keys(medObj), ['user'])
  Medmodel.find({user: req.user.id}).sort({inventory: 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    res.render('medViews/medIndex', {
      thead: thead,
      med: data,
      USER: req.user.username
    })
  })
}

function createNewMedPage (req, res) {
  res.render('medViews/medNew',
    {errMsg: req.flash('error'),
      USER: req.user.username
    })
}

function createNew (req, res) {
  var toAdd = cusFn.checkObj(req.body, medObj)
  var newMed = new Medmodel(toAdd)
  newMed.user = req.user.id

  newMed.save((err, saved, next) => {
    if (err) {
      console.log('failed to save new patient')
      var errors = cusFn.getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/clinic/medicine/new')
    } else {
      console.log('new med saved succeeded')
      res.redirect('/clinic/medicine')
    }
  })
}

function showOne (req, res, next) {
  var thead = cusFn.filterKeys(Object.keys(medObj), ['user'])
  Medmodel.findById(req.params.id).exec((err, data) => {
    if (err) console.error(err)
    res.render('medViews/medShow', {
      med: data,
      thead: thead,
      USER: req.user.username
    })
  })
}

function showEdit (req, res) {
  Medmodel.findById(req.query.id).exec((err, data) => {
    if (err) console.error(err)
    console.log(data)
    res.render('medViews/medEdit', {
      med: data,
      USER: req.user.username
    })
  })
}

function edit (req, res) {
  var toAdd = cusFn.checkObj(req.body, medObj)
  console.log('toAdd is ', toAdd)

  Medmodel.findById(req.params.id).exec((err, data) => {
    if (err) console.error(err)
    for (var key in toAdd) {
      if (Object.keys(medObj).includes(key)) {
        if (toAdd[key]) {
          data[key] = toAdd[key]
        }
      }
    }
    data.save((err, saved) => {
      if (err) console.error(err)
      res.redirect(data.id)
    })
  })
}

function remove (req, res) {
  console.log('req.body here ', req.body)
  console.log('req.params here ', req.params)

  Medmodel.findById(req.body.id).remove(function (err) {
    if (err) console.error(err)
    console.log('removed!')
    res.redirect('/clinic/medicine')
  })
}

module.exports = {
  index: showAll,
  toCreateNew: createNewMedPage,
  new: createNew,
  one: showOne,
  showEdit: showEdit,
  edit: edit,
  remove: remove
}

// module.exports = {
//   toCreateNew: createNewPatientPage,
//   new: createNew,
//   index: showAll,
//   one: showOne,
//   search: search,
//   showEdit: showEdit,
//   edit: edit,
//   remove: remove
// }
