var app = require('express')()
var port = process.env.PORT || 7777

// setup ejs template
var ejsLayouts = require('express-ejs-layouts')
app.set('view engine', 'ejs')
app.use(ejsLayouts)

// link to router page
var sampleController = require('./controllers/sample')
app.use('/', sampleController)

// error page
app.use(function (req, res) {
  res.send('error page')
})

app.listen(port, function () {
  console.log('app is running at ' + port)
})
