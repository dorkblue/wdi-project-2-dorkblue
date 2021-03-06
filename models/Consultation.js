var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var consultationObj = {
  'patient': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'patient'
  },
  'attending doctor': {
    type: String,
    required: [true, 'Attending Doctor required']
  },
  'date': {
    type: String,
    required: [true, 'Date of Consultation required']
  },
  'comments': {
    type: String
  },
  'prescription': [{
    medicine: {type: mongoose.Schema.Types.ObjectId,
      ref: 'medicine' },
    amount: String,
    unit: String
  }],
  'user': [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}

var consultationSchema = new mongoose.Schema(
  consultationObj,
  { retainKeyOrder: true,
    toObject: {
      transform: function (doc, ret, options) {
        // delete the password from the JSON data, and return
        // ret.date = ret.date.toLocaleDateString()
        delete ret.__v
        return ret
      }
    },
    toJSON: {
      transform: function (doc, ret, options) {
        // delete the password from the JSON data, and return
        // ret.date = ret.date.toLocaleDateString()
        delete ret.__v
        return ret
      }
    }
  }
)
// consultationSchema.pre('save', function (next) {
//   var consultation = this
//   console.log('thissssss', this)
//   if (consultation['comments'] === '') {
//     consultation['comments'] = 'No comment by ' + consultation['attending doctor']
//   }
//
//   next()
// })

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

module.exports = {
  obj: consultationObj,
  Model: mongoose.model('consultation', consultationSchema),
  toIgnore: ['comments', 'prescription'] // to ignore when listing all
}
