var Consultation = require('../models/Consultation')
var ConsultModel = Consultation.Model
var consultObj = Consultation.obj
var PatientModel = require('../models/Patient').Model
var Medmodel = require('../models/Medicine').Model
// var Usermodel = require('../models/User').Model
var cusFn = require('../public/js/modules')
var mongoose = require('mongoose')
mongoose.Promise = global.Promise

function showAll (req, res, next) {
  console.log(req.user.id)
  var thead = cusFn.filterKeys(Object.keys(consultObj), ['user'])

  ConsultModel.find({
    user: req.user.id
  })
    .populate({
      path: 'patient'
    })
    .populate({
      path: 'prescription.medicine'
    })
    .sort({
      'date': 'asc'
    }).exec((err, data) => {
      if (err) console.error(err)
      res.render('consultViews/consultIndex', {
        thead: thead,
        allConsult: data,
        user: cusFn.userIsAvailable(req.user)
      })
    })
}

function showOne (req, res, next) {
  var thead = cusFn.filterKeys(Object.keys(consultObj), ['user'])
  ConsultModel.findById(req.params.id)
    .populate('patient')
    .populate({
      path: 'prescription.medicine'
    })
    .exec((err, data) => {
      if (err) res.render()
      res.render('consultViews/consultShow', {
        consultation: data,
        thead: thead,
        user: cusFn.userIsAvailable(req.user)
      })
    })
}

function createNewConsultPage (req, res, next) {
  if (!req.query.id) next()
  PatientModel.findById(req.query.id, (err, foundPatient) => {
    if (err) console.error(err)
    Medmodel.find({})
      .select('name id')
      .sort({
        name: 'asc'
      })
      .exec((err, med) => {
        if (err) console.error(err)
        console.log(med)
        console.log(foundPatient)
        res.render('consultViews/consultNew', {
          errMsg: req.flash('error'),
          patient: foundPatient,
          user: cusFn.userIsAvailable(req.user),
          med: med
        })
      })
  })
}

function toCreateNewWithoutPatientId (req, res) {
  Medmodel.find({})
    .select('name id')
    .sort({
      name: 'asc'
    })
    .exec((err, med) => {
      if (err) console.error(err)
      console.log(med)
      res.render('consultViews/newWithoutPatient', {
        errMsg: req.flash('error'),
        user: cusFn.userIsAvailable(req.user),
        med: med
      })
    })
}

function createNew (req, res) {
  console.log(req.body)
  var toAdd = {}
  toAdd['attending doctor'] = req.body['attending doctor']
  toAdd.date = req.body.date
  toAdd.comments = req.body.comments
  if (!req.query.id) {
    toAdd.patient = req.body.patient
  } else {
    toAdd.patient = req.query.id
  }
  toAdd.user = req.user.id
  toAdd.prescription = []
  var prop = {}

  if (typeof req.body.medicine === 'string') {
    console.log('typeof', typeof req.body.medicine)
    if (req.body.medicine !== '') {
      prop.medicine = req.body.medicine
      prop.amount = req.body.amount
      prop.unit = req.body.unit
      toAdd.prescription.push(prop)
    }
  } else {
    for (var i = 0; i < req.body.medicine.length; i++) {
      console.log(i)
      if (req.body.medicine[i] !== '') {
        prop.medicine = req.body.medicine[i]
        prop.amount = req.body.amount[i]
        prop.unit = req.body.unit[i]
        toAdd.prescription.push(prop)
      }
    }
  }

  var newConsult = new ConsultModel(toAdd)

  newConsult.save((err, saved, next) => {
    if (err) {
      console.log('failed')
      console.log(err)
      var errors = cusFn.getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/consultation/new?id=' + toAdd.patient)
    } else {
      console.log('succeeded')
      console.log(saved)
      PatientModel.findById(toAdd.patient, (err, foundPatient) => {
        if (err) console.error(err)
        foundPatient.consultation.push(saved)
        foundPatient.save((err, saved) => {
          if (err) console.error(err)
          console.log('consultation saved to patient')
          res.redirect('/patient/' + foundPatient.id)
        })
      })
    }
  })
}

function showEdit (req, res) {
  console.log('req.query.id', req.query.id)
  ConsultModel.findById(req.query.id)
    .populate('patient')
    .populate({
      path: 'prescription.medicine'
    })
    .exec((err, data) => {
      if (err) console.error(err)
      Medmodel.find({})
    .select('name id')
    .sort({
      name: 'asc'
    })
    .exec((err, med) => {
      if (err) console.error(err)
      console.log(data)
      res.render('consultViews/consultEdit', {
        consultation: data,
        med: med,
        user: req.user.username
      })
    })
    })
}

function edit (req, res) {
  console.log(req.body)
  console.log(req.params.id)
  var toAdd = {}
  toAdd['attending doctor'] = req.body['attending doctor']
  toAdd.date = req.body.date
  toAdd.comments = req.body.comments
  toAdd.prescription = []
  var prop = {}

  if (typeof req.body.medicine === 'string') {
    console.log('typeof', typeof req.body.medicine)
    if (req.body.medicine !== '') {
      prop.medicine = req.body.medicine
      prop.amount = req.body.amount
      prop.unit = req.body.unit
      toAdd.prescription.push(prop)
    }
  } else {
    for (var i = 0; i < req.body.medicine.length; i++) {
      console.log(i)
      if (req.body.medicine[i] !== '') {
        prop.medicine = req.body.medicine[i]
        prop.amount = req.body.amount[i]
        prop.unit = req.body.unit[i]
        toAdd.prescription.push(prop)
      }
    }
  }
  console.log('toAdd here', toAdd)

  ConsultModel.findById(req.params.id).exec((err, data) => {
    if (err) console.error(err)
    console.log('before', data)
    for (var key in toAdd) {
      if (Object.keys(consultObj).includes(key)) {
        data[key] = toAdd[key]
      }
    }
    console.log(data)
    data.save((err, saved) => {
      if (err) console.error(err)
      res.redirect(data.id)
    })
  })
}

function remove (req, res) {
  console.log('req.body here ', req.body)
  console.log('req.params here ', req.params)

  ConsultModel.findById(req.body.id).remove(function (err) {
    if (err) console.error(err)
    console.log('removed!')
    res.redirect('/consultation')
  })
}

module.exports = {
  index: showAll,
  toCreateNew: createNewConsultPage,
  toCreateNewWithoutPatientId: toCreateNewWithoutPatientId,
  new: createNew,
  one: showOne,
  showEdit: showEdit,
  edit: edit,
  remove: remove
}
//
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
