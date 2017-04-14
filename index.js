// setup express
var express = require('express')
var app = express()
var port = process.env.PORT || 7777

// setup mongoose db
var mongoose = require('mongoose')
var dbURI = process.env.PROD_MONGODB || 'mongodb://localhost:27017/wdi-project-2'
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

// TODO update this if you need it
app.use(express.static('public'))

// link to unrestricted pages controller
// var pageRouter = require('./controllers/page_router')
// app.use('/', pageRouter)
// link to restricted patient page
var patientRouter = require('./routes/patient_router')
app.use('/clinic/patient', patientRouter)

// error page
app.use(function (req, res) {
  res.send('error page')
})

app.listen(port, function () {
  console.log('app is running at ' + port)
})
