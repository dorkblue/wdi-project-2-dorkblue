var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var patientSchema = new mongoose.Schema({
  firstname: {
    type: String
  },
  lastname: {
    type: String
  },
  ic: {
    type: String
  },
  consultationhistory: {
    type: mongoose.Schema.ObjectId,
    ref: 'Consultation'
  }
})

module.exports = mongoose.model('patient', patientSchema)
