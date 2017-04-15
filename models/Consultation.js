var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var consultationSchema = new mongoose.Schema({
  'patient': {
    type: mongoose.Schema.ObjectId,
    ref: 'Patient'
  },
  'attending doctor': {
    type: String,
    required: [true, 'Attending Doctor required']
  },
  'date': {
    type: Date,
    required: [true, 'Date of Consultation required']
  },
  'comments': {
    type: String,
    default: function () {
      if (this['comments'] === '') {
        return 'No comments.'
      }
    }
  },
  'medication': {
    type: mongoose.Schema.ObjectId,
    ref: 'Medication'
  }
},
  { retainKeyOrder: true,
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

consultationSchema.pre('save', function (next) {
  var consultation = this

  if (consultation['comments'] === '') {
    consultation['comments'] = 'No comment by ' + consultation['attending doctor']
  }

  next()
})

consultationSchema.statics.getPaths = function () {
  var allPaths = Object.keys(this.schema.paths)
  var filteredPaths = allPaths.filter(function (path) {
    if (path !== '_id' && path !== '__v') {
      console.log(path)
      return true
    }
  })
  return filteredPaths
}

module.exports = mongoose.model('consultation', consultationSchema)
