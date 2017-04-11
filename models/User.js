var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var bcrypt = require('bcrypt')

var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  lastname: {
    type: String,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: [3, 'Name must be between 3 and 99 characters'],
    maxlength: [99, 'Name must be between 3 and 99 characters']
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    match: emailRegex
  },
  password: {
    type: String,
    required: true,
    minlength: [8, 'Password must be between 8 and 99 characters'],
    maxlength: [99, 'Password must be between 8 and 99 characters']
  }
})
userSchema.set('toObject', { retainKeyOrder: true })

userSchema.pre('save', function (next) {
  var user = this

  if (!user.isModified('password')) return next()

  var hash = bcrypt.hashSync(user.password, 10)
  user.password = hash

  next()
})

// // to check if when login, user input password is correct to stored password
// userSchema.methods.validPassword = function (password) {
//   // Compare is a bcrypt method that will return a boolean
//   return bcrypt.compareSync(password, this.password)
// }
//
// userSchema.options.toJSON = {
//   transform: function (doc, ret, options) {
//     // delete the password from the JSON data, and return
//     delete ret.password
//     return ret
//   }
// }

module.exports = mongoose.model('User', userSchema)
