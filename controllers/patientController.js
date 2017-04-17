var Patient = require('../models/Patient')
var Patientmodel = Patient.Model
var patientObj = Patient.obj
var cusFn = require('../public/js/modules')


// {$text: {$search: req.query.term}}
function search (req, res, next) {
  console.log(req.query.term)
  Patientmodel.find({fullName: {$regex: req.query.term, $options: 'i'}}).select({'first name': 1, 'last name': 1, 'id': 1}).exec((err, data) => {
    if (err) console.error(err)
    console.log('data', data)
    var output = []
    data.forEach((item) => {
      var obj = {}
      obj.label = item['first name'] + ' ' + item['last name']
      obj.value = item['id']
      output.push(obj)
    })
    console.log('output', output)
    res.jsonp(output)
  })
}

function showAll (req, res, next) {
  console.log('showall passport user', req.user)
  var thead = cusFn.filterKeys(Object.keys(patientObj), ['consultation'])
  Patientmodel.find({user: req.user.id}).populate('user').sort({'last name': 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    console.log(data)
    res.render('patientViews/patientIndex', {
      thead: thead,
      allPatients: data,
      USER: req.user.username
    })
  })
}
//
// function showOne (req, res, next) {
//   Patientmodel.findById(req.params.patient_id, (err, data) => {
//     if (err) res.render()
//     res.render('patientViews/patientShow', {patient: data})
//   })
// }

function showOne (req, res, next) {
  console.log('showone passport user', req.user)
  Patientmodel.findById(req.params.patient_id).populate('consultation').exec((err, data) => {
    if (err) res.render()
    console.log(data.consultation)
    res.render('patientViews/patientShow', {
      patient: data,
      USER: req.user.username
    })
  })
}

function createNewPatientPage (req, res) {
  console.log('createNewPatientPage passport user', req.user)
  res.render('patientViews/newPatient.ejs',
    {errMsg: req.flash('error'),
      USER: req.user.username
    })
}

function createNew (req, res) {
  console.log('createNew passport user', req.user)

  var toAdd = cusFn.checkObj(req.body, patientObj)

  var newPatient = new Patientmodel(toAdd)
  newPatient.user = req.user.id

  newPatient.save((err, saved, next) => {
    if (err) {
      console.log('failed to save new patient')
      var errors = cusFn.getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/clinic/patient/new')
    } else {
      console.log('new patient saved succeeded')
      res.redirect('/clinic/patient')
    }
  })
}

module.exports = {
  toCreateNew: createNewPatientPage,
  new: createNew,
  index: showAll,
  one: showOne,
  search: search
}
