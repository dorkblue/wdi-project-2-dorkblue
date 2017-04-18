var mongoose = require('mongoose')
var modules = require('../public/js/modules')
mongoose.Promise = global.Promise

var patientObj = {
  'first name': {
    type: String,
    required: [true, 'First name required'],
    uppercase: true
  },
  'last name': {
    type: String,
    required: [true, 'Last name required'],
    uppercase: true
  },
  'id number': {
    type: String,
    required: [true, 'Identification number required'],
    unique: [true, 'Identification number exist in database'],
    uppercase: true
  },
  'gender': {
    type: String,
    required: [true, 'Gender required']
  },
  'date created': {
    type: String,
    default: modules.dateNow()
  },
  'consultation': [
    { type: mongoose.Schema.Types.ObjectId,
      ref: 'consultation' }
  ],
  'user': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}

var patientSchema = new mongoose.Schema(
  patientObj,
  {
    retainKeyOrder: true,
    toObject: {
      transform: function (doc, ret, options) {
        // delete the password from the JSON data, and return
        // useful when using iteration to output key-val from doc Object
        delete ret.__v
        return ret
      }
    }
  })
//
// patientSchema.index({'first name': 'text'})
// patientSchema.index({'last name': 'text'})

// patientSchema.statics.getPaths = function () {
//   console.log('schema paths here', this.schema.paths)
//   var allPaths = Object.keys(this.schema.paths)
//   var filteredPaths = allPaths.filter(function (path) {
//     if (path !== '_id' && path !== '__v' && path !== 'consultation') {
//       console.log(path)
//       return true
//     }
//   })
//   return filteredPaths
// }

patientSchema.virtual('fullName').get(function () {
  return this['first name'] + ' ' + this['last name']
})

module.exports = {
  obj: patientObj,
  Model: mongoose.model('patient', patientSchema)
}
