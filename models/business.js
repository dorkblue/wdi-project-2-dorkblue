var mongoose = require('mongoose')

var businessSchema = new mongoose.Schema(
  {
    username: {
      type: String
    },
    email: {
    },
    password: {
      type: String
    },
    dob: {
      type: String
    }
  },
  {
  // to retain key order
    retainKeyOrder: true
  })

module.exports = {
  Model: mongoose.model('business', businessSchema)
}
