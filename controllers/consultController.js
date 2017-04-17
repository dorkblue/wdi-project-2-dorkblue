var Consultation = require('../models/Consultation')
var PatientModel = require('../models/Patient').Model
var ConsultModel = Consultation.Model
var consultObj = Consultation.obj
var cusFn = require('../public/js/modules')

function showAll (req, res, next) {
  var thead = cusFn.filterKeys(Object.keys(consultObj), Consultation.toIgnore)

  ConsultModel.find({}).sort({'date': 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    res.render('consultViews/consultIndex', {thead: thead, allConsult: data})
  })
}

function showOne (req, res, next) {
  ConsultModel.findById(req.params.consult_id).populate('patient').exec((err, data) => {
    if (err) res.render()
    res.render('consultViews/consultShow', {consultation: data})
  })
}

function createNewConsultPage (req, res, next) {
  PatientModel.findById(req.query.id, (err, foundPatient) => {
    if (err) console.error(err)
    res.render('consultViews/consultNew',
      {errMsg: req.flash('error'),
        patient: foundPatient
      })
  })
}

function createNew (req, res) {
  // checkObj checks if there is empty string inputs
  var toAdd = cusFn.checkObj(req.body, consultObj)
  toAdd.patient = req.query.id

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

module.exports = {
  index: showAll,
  toCreateNew: createNewConsultPage,
  new: createNew,
  one: showOne
}
