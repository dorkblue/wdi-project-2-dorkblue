var express = require('express')
var mongoose = require('mongoose')
var Consultation = require('../models/Consultation')
var Patient = require('../models/Patient')

function showAll (req, res, next) {
  Consultation.find({}).sort({'date': 'asc'}).exec((err, data) => {
    if (err) console.error(err)

    res.render('consultViews/consultIndex', {thead: Consultation.getPaths(), allConsult: data})
  })
}

function createNewConsultPage (req, res, next) {
  Patient.findById(req.query.id, (err, foundPatient) => {
    if (err) console.error(err)
    res.render('consultViews/consultNew',
      {errMsg: req.flash('error'),
        patient: foundPatient
      })
  })
}

function createNew (req, res) {
  console.log(req.query)
  console.log(req.body)
  var newConsult = new Consultation()
  newConsult['patient'] = req.query.id
  newConsult['attending doctor'] = req.body['attending doctor']
  newConsult['date'] = req.body['date']
  newConsult['comments'] = req.body['comments']

  newConsult.save((err, saved, next) => {
    if (err) {
      console.log('failed')
      console.log(err)
      var errors = getErrMsg(err.errors)
      req.flash('error', errors)
      res.redirect('/clinic/consultation/new?id=' + req.query.id)
    } else {
      console.log('succeeded')
      console.log(saved)
      res.redirect('/clinic/consultation')
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

module.exports = {
  index: showAll,
  toCreateNew: createNewConsultPage,
  new: createNew
}
