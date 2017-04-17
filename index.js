// setup express
var express = require('express')
var app = express()
var port = process.env.PORT || 7777

// setup dotenv
require('dotenv').config({ silent: true })

// setup mongoose db
var mongoose = require('mongoose')
var dbURI = process.env.PROD_MONGODB || process.env.MONGODB_URI
mongoose.connect(dbURI, function (err) {
  if (err) console.error(err)
  console.log('connected to ' + dbURI)
})

// TODO update this if you need it
app.use(express.static('public'))
app.use(express.static('views'))

// setup bodyParser
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// setup sessions & connect-mongo
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ url: dbURI })
}))

// setup connect-flash
var flash = require('connect-flash')
app.use(flash())

// initialize passport configuration and session as middleware
var passport = require('./config/passport')
app.use(passport.initialize())
app.use(passport.session())

// setup ejs template
app.set('view engine', 'ejs')
var ejsLayouts = require('express-ejs-layouts')
app.use(ejsLayouts)

// link to unrestricted pages controller
// var pageRouter = require('./routers/pageRouter')
// app.use('/', pageRouter)
// link to auth pages controller
var authRouter = require('./routers/authRouter')
app.use('/', authRouter)

// link to restricted patient page
var patientRouter = require('./routers/patientRouter')
app.use('/clinic/patient', patientRouter)
// link to restricted patient's consultation page
var consultRouter = require('./routers/consultRouter')
app.use('/clinic/consultation', consultRouter)

// error page
app.use(function (req, res) {
  res.send('general error page')
})

app.listen(port, function () {
  console.log('app is running at ' + port)
})
