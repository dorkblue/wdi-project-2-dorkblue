// setup express
var app = require('express')()
var port = process.env.PORT || 7777

// setup mongoose db
var mongoose = require('mongoose')
var dbURI = process.env.PROD_MONGODB || 'mongodb://localhost:27017/wdi-project-2'
// var dbURI = 'mongodb://admin:admin@ds159200.mlab.com:59200/wdi-project-2' || 'mongodb://localhost:27017/wdi-project-2'
mongoose.connect(dbURI, function (err) {
  if (err) console.error(err)
  console.log('connected to ' + dbURI)
})

// setup ejs template
var ejsLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// setup bodyParser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// link to unrestricted pages controller
var pagesController = require('./controllers/pages_controller')
app.use('/', pagesController)

// error page
app.use(function (req, res) {
  res.send('error page')
})

app.listen(port, function () {
  console.log('app is running at ' + port)
})
