#!/usr/bin/env node
const app = require('../app')
const debug = require('debug')('mean-app:server')
const http = require('http')
const address = require('address')

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || '3000')
app.set('port', port)

// Create HTTP server.
const server = http.createServer(app)

// Listen on provided port, on all network interfaces.
server.listen(port, err => {
  if (err) throw err
  const CLEAR_CONSOLE = '\x1Bc'
  const GREEN_TEXT = '\x1b[32m'
  const BLACK_TEXT = '\x1b[30m'
  const RESET_TEXT = '\x1b[0m'
  const GREEN_BG = '\x1b[42m'
  const TEXT_TITLE = `${GREEN_BG}${BLACK_TEXT} DONE ${RESET_TEXT}`
  const TEXT_SUBTITLE = `${GREEN_TEXT}Compiled Successfully${RESET_TEXT}`

  process.stdout.write(CLEAR_CONSOLE)
  console.log(TEXT_TITLE + ' ' + TEXT_SUBTITLE)
  console.log()
  console.log('You can view the app in the browser:')
  console.log()
  console.log(`Local:               http://localhost:${port}`)
  console.log(`On Your Network:     http://${address.ip()}:${port}`)
  console.log()
})

server.on('error', onError)
server.on('listening', onListening)

// Normalize a port into a number, string, or false.
function normalizePort (val) {
  let port = parseInt(val, 10)

  if (isNaN(port)) {
    // named pipe
    return val
  }

  if (port >= 0) {
    // port number
    return port
  }

  return false
}

// Event listener for HTTP server "error" event.
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }

  let bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges')
      process.exit(1)

    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)

    default:
      throw error
  }
}

// Event listener for HTTP server "listening" event.
function onListening () {
  let addr = server.address()
  let bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port
  debug('Listening on ' + bind)
}
