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
  var thead = cusFn.filterKeys(Object.keys(consultObj), Consultation.toIgnore)

  ConsultModel.find({user: req.user.id})
  .populate({
    path: 'patient',
    populate: {path: 'user'}
  }).sort({'date': 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    res.render('consultViews/consultIndex', {
      thead: thead,
      allConsult: data,
      USER: cusFn.userIsAvailable(req.user)
    })
  })
}

function showOne (req, res, next) {
  ConsultModel.findById(req.params.consult_id)
  .populate('patient')
  .populate({
    path: 'prescription.medicine'
  })
  .exec((err, data) => {
    console.log('data', data.prescription[0])
    if (err) res.render()
    res.render('consultViews/consultShow', {
      consultation: data,
      USER: cusFn.userIsAvailable(req.user)
    })
  })
}

function createNewConsultPage (req, res, next) {
  PatientModel.findById(req.query.id, (err, foundPatient) => {
    if (err) console.error(err)
    Medmodel.find({})
    .select('name id')
    .sort({name: 'asc'})
    .exec((err, med) => {
      if (err) console.error(err)
      console.log(med)
      console.log(foundPatient)
      res.render('consultViews/consultNew',
        {errMsg: req.flash('error'),
          patient: foundPatient,
          USER: cusFn.userIsAvailable(req.user),
          med: med
        })
    })
  })
}

function createNew (req, res) {
  console.log(req.body)
  var toAdd = {}
  toAdd['attending doctor'] = req.body['attending doctor']
  toAdd.date = req.body.date
  toAdd.comments = req.body.comments
  toAdd.patient = req.query.id
  toAdd.user = req.user.id
  toAdd.prescription = []

  for (var i = 0; i < req.body.medicine.length; i++) {
    var prop = {}
    prop.medicine = req.body.medicine[i]
    prop.amount = req.body.amount[i]
    prop.unit = req.body.unit[i]
    toAdd.prescription.push(prop)
  }
  console.log(toAdd.prescription)
  console.log(toAdd)
  // checkObj checks if there is empty string inputs

  toAdd = cusFn.checkObj(toAdd, consultObj)

  console.log(toAdd)
  var newConsult = new ConsultModel(toAdd)

  newConsult.save((err, saved, next) => {
    if (err) {
      console.log('failed')
      console.log(err)
      var errors = cusFn.getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/clinic/consultation/new?id=' + req.query.id)
    } else {
      console.log('succeeded')
      console.log(saved)
      PatientModel.findById(req.query.id, (err, foundPatient) => {
        if (err) console.error(err)
        foundPatient.consultation.push(saved)
        foundPatient.save((err, saved) => {
          if (err) console.error(err)
          console.log('consultation saved to patient')
        })
      })
      res.redirect('/clinic/patient/' + req.query.id)
    }
  })
}
function showEdit (req, res) {

}

module.exports = {
  index: showAll,
  toCreateNew: createNewConsultPage,
  new: createNew,
  one: showOne,
  showEdit: showEdit
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
