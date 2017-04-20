var User = require('../models/User')
var Usermodel = User.Model
var userObj = User.obj

var cusFn = require('../public/js/modules')

function showAll (req, res) {
  var thead = cusFn.filterKeys(Object.keys(userObj), ['password'])

  Usermodel.find({}, (err, users) => {
    if (err) console.error(err)
    res.render('userViews/userIndex',
      {
        users: users,
        thead: thead
      })
  })
}

function showOne (req, res) {
  var thead = cusFn.filterKeys(Object.keys(userObj), ['password'])

  Usermodel.findById(req.params.id, (err, user) => {
    if (err) console.error(err)
    res.render('userViews/userShow', {
      user: user,
      thead: thead
    })
  })
}

function createNewPage (req, res) {
  res.render('userViews/userNew')
}

function createNewUser (req, res) {
  console.log('creating new user')
  var newUser = new Usermodel(req.body)

  newUser.save(function (err, data) {
    if (err) console.error(err)
    console.log('new user created')
    res.redirect('/users')
  })
}

function editUser (req, res) {
  console.log(req.body)
  Usermodel.findById(req.params.id, (err, user) => {
    if (err) console.error(err)
    for (var key in req.body) {
      if (req.body[key] !== '') {
        console.log(key)
        user[key] = req.body[key]
      }
    }
    user.save((err, saved) => {
      if (err) console.error(err)
      res.redirect('/users/' + saved.id)
    })
  })
}

function remove (req, res) {
  console.log('req.body here ', req.body)
  console.log('req.params here ', req.params)

  Usermodel.findById(req.body.id).exec((err, user) => {
    if (err) console.error(err)
    user.remove()
    res.redirect('/users')
  })
}

module.exports = {
  index: showAll,
  one: showOne,
  createNewPage: createNewPage,
  new: createNewUser,
  edit: editUser,
  remove: remove
}
