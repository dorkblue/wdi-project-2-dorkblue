var express = require('express')
var mongoose = require('mongoose')
var Patient = require('../models/Patient')

function showAll (req, res, next) {
  Patient.find({}).sort({'last name': 'asc'}).exec((err, data) => {
    if (err) console.error(err)
    res.render('patientViews/patientIndex', {thead: Patient.getPaths(), allPatients: data})
  })
}

function showOne (req, res, next) {
  console.log(req.params.patient_id)
  Patient.findById(req.params.patient_id, (err, data) => {
    if (err) res.render()
    res.render('patientViews/patientShow', {patient: data})
  })
}

function createNewPatientPage (req, res) {
  res.render('patientViews/newPatient.ejs',
    {errMsg: req.flash('error')
    })
}

function createNew (req, res) {
  console.log(req.body)
  var newPatient = new Patient()
  newPatient['first name'] = req.body.firstname
  newPatient['last name'] = req.body.lastname
  newPatient['gender'] = req.body.gender
  newPatient['id number'] = req.body.ic

  newPatient.save((err, saved, next) => {
    if (err) {
      console.log('failed')
      console.log(err)
      var errors = getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/clinic/patient/new')
    } else {
      console.log('succeeded')
      res.redirect('/clinic/patient')
    }
  })
}

function getErrMsg (input) {
  console.log(input)
  var errMsgs = []
  for (var key in input) {
    errMsgs.push(input[key].message)
  }
  return errMsgs
}

function getSchemaPath (model) {
  var schemaPaths = Object.keys(model.schema.paths)
  console.log(schemaPaths)
}

module.exports = {
  toCreateNew: createNewPatientPage,
  new: createNew,
  index: showAll,
  one: showOne
}
