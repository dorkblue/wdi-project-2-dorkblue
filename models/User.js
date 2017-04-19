// mongoose setup
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
// bcrypt setup
var bcrypt = require('bcryptjs')
// email regex
var emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/

var userObj = {
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
}

/* UserSchema setup */
var userSchema = new mongoose.Schema(
  userObj,
  {
  // to retain key order
    retainKeyOrder: true
  })

// hashing password before save
userSchema.pre('save', function (next) {
  var user = this
  console.log('checking if password is modified')
  // doc#isModified: check if password is modified
  if (!user.isModified('password')) {
    console.log('password not modified, (re-)hashing not required')
    return next()
  }

  var hash = bcrypt.hashSync(user.password, 10)
  user.password = hash

  next()
})

// to check if when login, user input password is correct to stored password
userSchema.methods.validPassword = function (password) {
  // Compare is a bcrypt method that will return a boolean
  return bcrypt.compareSync(password, this.password)
}

userSchema.options.toJSON = {
  transform: function (doc, ret, options) {
    // delete the password from the JSON data, and return
    delete ret.password
    return ret
  }
}

module.exports = {
  Model: mongoose.model('User', userSchema),
  obj: userObj
}

// module.exports = {
//   Model: UserModel
// }
