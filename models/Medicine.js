var mongoose = require('mongoose')
mongoose.Promise = global.Promise

var medObj = {
  name: String,
  supplier: String,
  inventory: Number,
  unit: String,
  'user': {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}

var medSchema = new mongoose.Schema(medObj)

module.exports = {
  Model: mongoose.model('medicine', medSchema),
  obj: medObj
}
