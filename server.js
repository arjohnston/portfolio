const express = require('express')
const compression = require('compression')
const next = require('next')
const LRUCache = require('lru-cache')
const bodyParser = require('body-parser')

const dev =
  process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
const test = process.env.NODE_ENV === 'test'

const nextApp = next({ dir: '.', dev })
const handle = nextApp.getRequestHandler()
const path = require('path')
const address = require('address')
const morgan = require('morgan')
const helmet = require('helmet')
const expressSanitizer = require('express-sanitizer')
const setup = require('./utils/config/setup')
const createAdminUser = require('./utils/config/createAdminUser')

// TODO
// Setup travis CI
// IP location lock for login attempts
// TFA on login
// Setup account = change user + password on first login
// Hello world dashboard

// Name the database based if its in test mode or development/production
const DATABASE_NAME = test ? 'portfolio-test' : 'portfolio'

// Utilize port 3000 for Development
// Utilize port 8080 for Production
const PORT = dev ? '3000' : '8080'

// This is where we cache our rendered HTML pages
const cacheTime = dev ? 100 : 1000 * 60 * 60 // 1 hour
const ssrCache = new LRUCache({
  max: 100,
  maxAge: cacheTime
})

class Server {
  constructor () {
    // Configure Mongoose
    const mongoose = require('mongoose')
    mongoose.Promise = require('bluebird')
    this.mongoose = mongoose

    this.app = express()

    this.clearTerminal()
  }

  configureApp () {
    return setup()
  }

  start () {
    // Import routes
    const auth = require('./api/routes/auth')
    const contact = require('./api/routes/contact')
    const recaptcha = require('./api/routes/recaptcha')

    // Configure and connect to Mongoose
    this.mongoose
      .connect(`mongodb://localhost/${DATABASE_NAME}`, {
        promiseLibrary: require('bluebird'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
      })
      .then(() => {
        console.log(
          this.formatTerminalOutput({ text: 'DONE', type: 'title' }) +
            ' ' +
            this.formatTerminalOutput({
              text: 'MongoDB Connection Successful',
              type: 'body'
            })
        )
        console.log()

        createAdminUser()
      })
      .catch(error => console.error(error))

    this.mongoose.set('useFindAndModify', false)

    nextApp.prepare().then(() => {
      // const app = express()
      this.app.use(compression())
      this.app.use(expressSanitizer())
      // Use body-parser
      this.app.use(bodyParser.json({ limit: '1mb' }))
      this.app.use(
        bodyParser.urlencoded({
          extended: 'false'
        })
      )

      if (!dev && !test) {
        const sixtyDaysInSeconds = 5184000
        this.app.use(
          helmet.hsts({
            maxAge: sixtyDaysInSeconds
          })
        )

        this.app.use(
          helmet.contentSecurityPolicy({
            directives: {
              scriptSrc: ["'self'", 'www.google-analytics.com', 'data:']
            }
          })
        )
        this.app.use(
          helmet.referrerPolicy({ policy: 'strict-origin-when-cross-origin' })
        )

        this.app.use(
          helmet.featurePolicy({
            features: {
              fullscreen: ["'self'"],
              geolocation: ["'self'"]
            }
          })
        )

        this.app.use(helmet.noSniff())

        this.app.disable('x-powered-by')
      }

      this.app.get('/service-worker.js', (req, res) => {
        const parsedUrl = new URL(req.url, 'https://arjohnston.dev')
        const { pathname } = parsedUrl

        const filePath = path.join(__dirname, '.next', pathname)
        nextApp.serveStatic(req, res, filePath)
      })

      // Method to cache pages on load
      // Populate all pages to be stored in cache
      this.app.get('/', (req, res) => {
        this.renderAndCache(req, res, '/')
      })

      // Routes for all APIs here
      this.app.use('/api/auth', auth)
      this.app.use('/api/contact', contact)
      this.app.use('/api/recaptcha', recaptcha)

      // This strips away the trailing '/' in the route
      // eslint throwing an unnecessary error with the regex '\/'
      this.app.get('\\S+/$', (req, res) => {
        return res.redirect(
          301,
          req.path.slice(0, -1) + req.url.slice(req.path.length)
        )
      })

      // serve the remaining pages that are not caught by redirects
      // or renderAndCache
      this.app.get('*', (req, res) => {
        return handle(req, res)
      })

      // Use Morgan for additional logging
      if (dev) {
        this.app.use(morgan('dev'))
      }

      this.server = this.app.listen(PORT, error => {
        if (error) throw error

        // Avoid printing the following output
        // while mocha & chai are running
        if (!test) {
          console.log(
            this.formatTerminalOutput({ text: 'DONE', type: 'title' }) +
              ' ' +
              this.formatTerminalOutput({
                text: 'Compiled Successfully',
                type: 'body'
              })
          )
          console.log()
          console.log('You can view the app in the browser:')
          console.log()
          console.log(`Local:               http://localhost:${PORT}`)
          console.log(`On Your Network:     http://${address.ip()}:${PORT}`)
          console.log()

          if (!dev) {
            console.log(
              'To utilize hot reloading for development, open a new terminal and run `npm run dev`'
            )
            console.log()
          }
        }
      })
    })
  }

  stop (done) {
    this.server.close()
    this.mongoose.connection.close(done)
  }

  getServerInstance () {
    return this.app
  }

  // Utility functions for terminal output formatting
  formatTerminalOutput (options) {
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

  clearTerminal () {
    const CLEAR_CONSOLE = '\x1Bc'

    process.stdout.write(CLEAR_CONSOLE)
  }

  /*
   * NB: make sure to modify this to take into account anything that should trigger
   */
  getCacheKey (req) {
    return `${req.url}`
  }

  renderAndCache (req, res, pagePath, queryParams) {
    const key = this.getCacheKey(req)

    // If we have a page in the cache, let's serve it
    if (ssrCache.has(key)) {
      // Enable to track cache logging
      // console.log(`CACHE HIT: ${key}`)
      res.send(ssrCache.get(key))
      return
    }

    // If not let's render the page into HTML
    nextApp
      .renderToHTML(req, res, pagePath, queryParams)
      .then(html => {
        // Let's cache this page
        // Enable to track cache logging
        // console.log(`CACHE MISS: ${key}`)
        ssrCache.set(key, html)

        res.send(html)
      })
      .catch(err => {
        nextApp.renderError(err, req, res, pagePath, queryParams)
      })
  }
}

if (typeof module !== 'undefined' && !module.parent) {
  const server = new Server()
  server.configureApp().then(() => server.start())
}

// Export the server so Mocha & Chai can have access to it
module.exports = { Server }
