const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const app = express()
const morgan = require('morgan')
const http = require('http')
const address = require('address')
const mongoose = require('mongoose')

// Import routes
const book = require('./routes/book')
const auth = require('./routes/auth')

// Set the port to 3000 for development and 8080 for production
const DEV = process.env.NODE_ENV !== 'production'
const PORT = DEV ? '3000' : '8080'

// Configure Mongoose
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost/mern-auth', { promiseLibrary: require('bluebird') })
  .then(() => {
    console.log(formatTerminalOutput({text: 'MongoDB Connection Successful', type: 'body'}))
    console.log()
  })
  .catch((err) => console.error(err))

// Configure Express
// Set the port
app.set('port', PORT)

// Use body-parser
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({'extended': 'false'}))

// Serve the index.html build
app.use(express.static(path.join(__dirname, 'build')))

// Use Morgan for additional logging in development
if (DEV) app.use(morgan('dev'))

// Routes for all APIs here
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

  if (!DEV) delete err.stack

  res.status(err.statusCode || 500).json(err)
})

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(PORT, err => {
  if (err) throw err

  clearTerminal()
  console.log(
    formatTerminalOutput({text: 'DONE', type: 'title'}) +
    ' ' +
    formatTerminalOutput({text: 'Compiled Successfully', type: 'body'})
  )
  console.log()
  console.log('You can view the app in the browser:')
  console.log()
  console.log(`Local:               http://localhost:${server.address().port}`)
  console.log(`On Your Network:     http://${address.ip()}:${server.address().port}`)
  console.log()
})

// Utility functions
function formatTerminalOutput (options) {
  const GREEN_TEXT = '\x1b[32m'
  const BLACK_TEXT = '\x1b[30m'
  const RESET_TEXT = '\x1b[0m'
  const GREEN_BG = '\x1b[42m'

  if (options.type === 'title') {
    return `${GREEN_BG}${BLACK_TEXT} ${options.text} ${RESET_TEXT}`
  } else {
    return `${GREEN_TEXT}${options.text}${RESET_TEXT}`
  }
}

function clearTerminal () {
  const CLEAR_CONSOLE = '\x1Bc'

  process.stdout.write(CLEAR_CONSOLE)
}
