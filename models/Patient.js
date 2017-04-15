var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var patientSchema = new mongoose.Schema({
  'first name': {
    type: String,
    required: [true, 'First name required']
  },
  'last name': {
    type: String,
    required: [true, 'Last name required']
  },
  'id number': {
    type: String,
    required: [true, 'Identification Number required'],
    unique: [true, 'Identification Number exist in database']
  },
  'gender': {
    type: String,
    required: [true, 'Gender required']
  },
  'consultation': {
    type: mongoose.Schema.ObjectId,
    ref: 'Consultation'
  }
},
  { retainKeyOrder: true,
    timestamps: {
      createdAt: 'date created',
      updatedAt: 'date updated'
    },
    toObject: {
      transform: function (doc, ret, options) {
        // delete the password from the JSON data, and return
        delete ret.__v
        delete ret._id
        return ret
      }
    }
  }
)

patientSchema.statics.getPaths = function () {
  var allPaths = Object.keys(this.schema.paths)
  var filteredPaths = allPaths.filter(function (path) {
    if (path !== '_id' && path !== '__v' && path !== 'consultation') {
      console.log(path)
      return true
    }
  })
  return filteredPaths
}

patientSchema.virtual('fullName').get(function () {
  return this['first name'] + ', ' + this['last name']
})

module.exports = mongoose.model('patient', patientSchema)
