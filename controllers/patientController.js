var Patient = require('../models/Patient')
var Patientmodel = Patient.Model
var patientObj = Patient.obj
var Consultation = require('../models/Consultation')
var ConsultModel = Consultation.Model
var consultObj = Consultation.obj
var cusFn = require('../public/js/modules')

// {$text: {$search: req.query.term}}
function search (req, res, next) {
  var lookFor = {$regex: req.query.term, $options: 'i'}
  console.log(req.query.term)
  Patientmodel.find({
    user: req.user.id,
    $or: [
      {'first name': lookFor},
      {'last name': lookFor}
    ]})
    .select({'first name': 1, 'last name': 1, 'id': 1})
    .exec((err, data) => {
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
  var thead = cusFn.filterKeys(Object.keys(patientObj), ['consultation', 'user'])
  Patientmodel.find({user: req.user.id}).populate('user').sort({'last name': 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    res.render('patientViews/patientIndex', {
      thead: thead,
      allPatients: data,
      USER: req.user.username
    })
  })
}

function showOne (req, res, next) {
  var thead = cusFn.filterKeys(Object.keys(patientObj), ['consultation', 'user'])
  var consultPath = cusFn.filterKeys(Object.keys(consultObj), ['patient', 'user'])

  Patientmodel.findById(req.params.id)
  .populate({
    path: 'consultation'
  })
  .populate({
    path: 'consultation',
    populate: {
      path: 'prescription.medicine'
    }
  })
  .exec((err, data) => {
    if (err) console.error(err)
    res.render('patientViews/patientShow', {
      thead: thead,
      consultPath: consultPath,
      patient: data,
      USER: req.user.username
    })
  })
}

function createNewPatientPage (req, res) {
  res.render('patientViews/newPatient.ejs',
    {errMsg: req.flash('error'),
      USER: req.user.username
    })
}

function createNew (req, res) {
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

function showEdit (req, res) {
  Patientmodel.findById(req.query.id).populate('consultation').exec((err, data) => {
    if (err) console.error(err)
    console.log(data)
    res.render('patientViews/patientEdit', {
      patient: data,
      USER: req.user.username
    })
  })
}

function edit (req, res) {
  var toAdd = cusFn.checkObj(req.body, patientObj)
  console.log('toAdd is ', toAdd)

  Patientmodel.findById(req.params.id).populate('consultation').exec((err, data) => {
    if (err) console.error(err)
    for (var key in toAdd) {
      if (Object.keys(patientObj).includes(key)) {
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

  Patientmodel.findById(req.body.id).remove(function (err) {
    if (err) console.error(err)
    console.log('removed!')
    res.redirect('/clinic/patient')
  })
}

module.exports = {
  toCreateNew: createNewPatientPage,
  new: createNew,
  index: showAll,
  one: showOne,
  search: search,
  showEdit: showEdit,
  edit: edit,
  remove: remove
}
