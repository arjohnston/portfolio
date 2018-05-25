const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const logger = require('morgan')
const book = require('./routes/book')
const auth = require('./routes/auth')

var mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost/mern-auth', { promiseLibrary: require('bluebird') })
  .then(() => console.log('MongoDB Connection Successful'))
  .catch((err) => console.error(err))

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': 'false'}))
app.use(express.static(path.join(__dirname, 'build')))

app.use('/api/book', book)
app.use('/api/auth', auth)

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  let err = new Error('Not Found')
  console.log('req: ', req)
  err.status = 404
  next(err)
})

// Error handler
app.use(function (err, req, res, next) {
  console.log(err)

  if (req.app.get('env') !== 'development') {
    delete err.stack
  }

  res.status(err.statusCode || 500).json(err)
})

module.exports = app
