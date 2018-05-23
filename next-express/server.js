/* jshint esversion: 6 */
const express = require('express')
const compression = require('compression')
const next = require('next')
const LRUCache = require('lru-cache')
const bodyParser = require('body-parser')
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dir: '.', dev })
const handle = app.getRequestHandler()
const path = require('path')
const address = require('address')
const { parse } = require('url')

// require('es6-promise').polyfill()
// require('isomorphic-fetch')

// This is where we cache our rendered HTML pages
let cacheTime = dev ? 100 : 1000 * 60 * 60 // 1 hour
const ssrCache = new LRUCache({
  max: 100,
  maxAge: cacheTime
})

app.prepare().then(() => {
  const server = express()
  server.use(compression())
  server.use(bodyParser.json())

  server.get('/service-worker.js', (req, res) => {
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    const filePath = path.join(__dirname, '.next', pathname)
    app.serveStatic(req, res, filePath)
  })

  // Method to cache pages on load
  // Populate all pages to be stored in cache
  server.get('/', (req, res) => {
    renderAndCache(req, res, '/')
  })

  // Serve static files at root
  const options = {
    root: path.join(__dirname, '/static/'),
    headers: {
      'Content-Type': 'text/plain;charset=UTF-8'
    }
  }
  server.get('/robots.txt', (req, res) =>
    res.status(200).sendFile('robots.txt', options)
  )
  server.get('/favicon.ico', (req, res) =>
    res.status(200).sendFile('favicon.ico', options)
  )
  server.get('/sitemap.xml', (req, res) =>
    res.status(200).sendFile('sitemap.xml', options)
  )

  // Utilize the below for each redirect
  // server.get(url, function (req, res) {
  //   res.redirect(newUrl)
  // })

  // This strips away the trailing '/' in the route
  // eslint throwing an unnecessary error with the regex '\/'
  /* eslint-disable */
  server.get('\\S+/$', function(req, res) {
    return res.redirect(
      301,
      req.path.slice(0, -1) + req.url.slice(req.path.length)
    )
  })
  /* eslint-enable */

  // serve the remaining pages that are not caught by redirects
  // or renderAndCache
  server.get('*', (req, res) => {
    return handle(req, res)
  })

  if (dev) {
    server.listen(3000, err => {
      if (err) {
        console.log(err)
        throw err
      }
      console.log('You can view the app in the browser:')
      console.log()
      console.log('Local:               http://localhost:3000')
      console.log(`On Your Network:     http://${address.ip()}:3000`)
      console.log()
      console.log('Note that the development build is not optimized.')
      console.log('To create a production build, use npm run build')
    })
  } else {
    server.listen(8080, err => {
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
      console.log('Local:               http://localhost:8080')
      console.log(`On Your Network:     http://${address.ip()}:8080`)
    })
  }
})

/*
 * NB: make sure to modify this to take into account anything that should trigger
 */
function getCacheKey (req) {
  return `${req.url}`
}

function renderAndCache (req, res, pagePath, queryParams) {
  const key = getCacheKey(req)

  // If we have a page in the cache, let's serve it
  if (ssrCache.has(key)) {
    // Enable to track cache logging
    // console.log(`CACHE HIT: ${key}`)
    res.send(ssrCache.get(key))
    return
  }

  // If not let's render the page into HTML
  app
    .renderToHTML(req, res, pagePath, queryParams)
    .then(html => {
      // Let's cache this page
      // Enable to track cache logging
      // console.log(`CACHE MISS: ${key}`)
      ssrCache.set(key, html)

      res.send(html)
    })
    .catch(err => {
      app.renderError(err, req, res, pagePath, queryParams)
    })
}












// /* jshint esversion: 6 */
// const config = require('./utils/config')
// const express = require('express')
// // const spdy = require('spdy')
// const compression = require('compression')
// const next = require('next')
// const LRUCache = require('lru-cache')
// const expressSanitizer = require('express-sanitizer')
// const bodyParser = require('body-parser')
// const dev = process.env.NODE_ENV !== 'production'
// const app = next({ dir: '.', dev })
// const handle = app.getRequestHandler()
// let cacheTime = 1000 * 60 * 60 // 1 hour
// const path = require('path')
// const address = require('address')
// const { parse } = require('url')
//
// // require('es6-promise').polyfill()
// // require('isomorphic-fetch')
//
// if (dev) cacheTime = 100
//
// // This is where we cache our rendered HTML pages
// const ssrCache = new LRUCache({
//   max: 100,
//   maxAge: cacheTime
// })
//
// app.prepare().then(() => {
//   const server = express()
//   server.use(compression())
//   server.use(bodyParser.json())
//   server.use(expressSanitizer())
//
//   server.get('/service-worker.js', (req, res) => {
//     const parsedUrl = parse(req.url, true)
//     const { pathname } = parsedUrl
//
//     const filePath = path.join(__dirname, '.next', pathname)
//     app.serveStatic(req, res, filePath)
//   })
//
//   // Use the renderAndCache to cache pages
//   // Currently using pages with exensive images and/or videos
//   server.get('/', (req, res) => {
//     renderAndCache(req, res, '/')
//   })
//
//   // Serve static files at root
//   const options = {
//     root: path.join(__dirname, '/static/'),
//     headers: {
//       'Content-Type': 'text/plain;charset=UTF-8'
//     }
//   }
//   server.get('/robots.txt', (req, res) =>
//     res.status(200).sendFile('robots.txt', options)
//   )
//   server.get('/robots_www.txt', (req, res) =>
//     res.status(200).sendFile('robots_www.txt', options)
//   )
//   server.get('/favicon.ico', (req, res) =>
//     res.status(200).sendFile('favicon.ico', options)
//   )
//   server.get('/sitemap.xml', (req, res) =>
//     res.status(200).sendFile('sitemap.xml', options)
//   )
//   server.get('/eualert/license.html', (req, res) =>
//     res.redirect('/static/html/eualert/license.html')
//   )
//   server.get('/eucert/license.html', (req, res) =>
//     res.redirect('/static/html/eucert/license.html')
//   )
//
//   // CONVERT TO .js & DEPRECATE
//   server.get('/privacy_mobile.html', (req, res) =>
//     res.redirect('/static/html/privacy_mobile.html')
//   )
//
//   server.get('/license.html', (req, res) =>
//     res.redirect('/legal/user-agreement')
//   )
//   server.get('/privacy.html', (req, res) =>
//     res.redirect('/legal/privacy-policy')
//   )
//
//   // Fetch POST data for form submissions
//   server.post('/api/recaptcha', (req, res) => {
//     if (dev) return { result: 'DEV', status: 200 }
//
//     if (req.body.key) {
//       let url =
//         'https://www.google.com/recaptcha/api/siteverify?secret=' +
//         config.google.RECAPTCHA_SECRET_KEY +
//         '&response=' +
//         req.body.key
//
//       fetch(url, {
//         method: 'POST'
//       })
//         .then(response => {
//           if (response.status >= 200 && response.status < 300) {
//             return response.json()
//           } else {
//             let error = new Error(response.statusText)
//             error.response = response
//             throw error
//           }
//         })
//         .then(data => {
//           res.status(200).send({ result: data.success })
//         })
//         .catch(err => {
//           console.log(err)
//           res.sendStatus(err.response.status)
//         })
//     }
//   })
//
//   server.post('/api/submit', (req, res) => {
//     if (req.body) {
//       // let prodURL =
//       // 'http://prodweb.ad.emergencyuniversity.com/ws/Lead.svc/ProcessLead'
//       let devURL =
//         'http://kschricker.emergencyuniversity.com/ws/Lead.svc/ProcessLead'
//       // let url = dev ? devURL : prodURL
//       let url = devURL
//       let sanitizedBody = {}
//
//       // Sanitize the values
//       sanitizedBody.firstname = req.sanitize(req.body.firstname)
//       sanitizedBody.lastname = req.sanitize(req.body.lastname)
//       sanitizedBody.company = req.sanitize(req.body.company)
//       sanitizedBody.title = req.sanitize(req.body.title)
//       sanitizedBody.email = req.sanitize(req.body.email)
//       sanitizedBody.phone = req.sanitize(req.body.phone)
//       sanitizedBody.comments = req.sanitize(req.body.comments)
//       sanitizedBody.contacttype = req.sanitize(req.body.contacttype)
//       sanitizedBody.language = req.sanitize(req.body.language)
//       sanitizedBody.admintype = req.sanitize(req.body.admintype)
//       sanitizedBody.support = req.sanitize(req.body.support)
//       sanitizedBody.spec = req.sanitize(req.body.spec)
//
//       sanitizedBody.arrInterest = []
//       req.body.arrInterest.forEach(e => {
//         sanitizedBody.arrInterest.push(req.sanitize(e))
//       })
//
//       sanitizedBody.arrSurveyQuestions = []
//       req.body.arrSurveyQuestions.forEach(e => {
//         sanitizedBody.arrSurveyQuestions.push(req.sanitize(e))
//       })
//
//       console.log(sanitizedBody)
//
//       fetch(url, {
//         method: 'POST',
//         body: JSON.stringify(sanitizedBody),
//         headers: {
//           Accept: 'application/json',
//           'Content-Type': 'application/json; charset=utf-8'
//         }
//       })
//         .then(response => {
//           if (response.status >= 200 && response.status < 300) {
//             return response.json()
//           } else {
//             let error = new Error(response.statusText)
//             error.response = response
//             throw error
//           }
//         })
//         .then(data => {
//           res.sendStatus(200)
//         })
//         .catch(err => {
//           console.log(err)
//           res.sendStatus(err.response.status)
//         })
//     }
//   })
//
//   // Redirects
//   server.get('/media/:media', function (req, res) {
//     res.redirect('http://www.emergencyuniversity.com/media/' + req.params.media)
//   })
//
//   for (let url in config.redirects) {
//     server.get(url, function (req, res) {
//       res.redirect(config.redirects[url])
//     })
//   }
//
//   for (let i in config.states) {
//     server.get(
//       `/compliance/state/${config.states[i].toLowerCase().replace(/ /g, '-')}`,
//       function (req, res) {
//         res.redirect(
//           `/regulations/state-aed-regulations/${config.states[i]
//             .toLowerCase()
//             .replace(/ /g, '-')}`
//         )
//       }
//     )
//     // Handles user-refreshes while on generated state page
//     server.get(
//       `/regulations/state-aed-regulations/${config.states[i]
//         .toLowerCase()
//         .replace(/ /g, '-')}`,
//       (req, res) => {
//         renderAndCache(req, res, '/regulations/state-aed-regulations', {
//           state: config.states[i].toLowerCase().replace(/ /g, '-')
//         })
//       }
//     )
//   }
//   server.get('/regulations/state-aed-regulations', (req, res) =>
//     res.redirect('/regulations')
//   )
//
//   // Handles user-refreshes while on EUAlert page
//   server.get('/customer/csx/eualert', (req, res) =>
//     renderAndCache(req, res, '/customer/eualert', {
//       company: 'csx'
//     })
//   )
//   server.get('/customer/23andme/eualert', (req, res) =>
//     renderAndCache(req, res, '/customer/eualert', {
//       company: '23andme'
//     })
//   )
//   server.get('/customer/deactivated/faa/eualert', (req, res) =>
//     renderAndCache(req, res, '/customer/eualert', {
//       company: 'faa'
//     })
//   )
//   server.get('/customer/deactivated/twitter/eualert', (req, res) =>
//     renderAndCache(req, res, '/customer/eualert', {
//       company: 'twitter'
//     })
//   )
//
//   // This strips away the trailing '/' in the route
//   // eslint throwing an unnecessary error with the regex '\/'
//   /* eslint-disable */
//   server.get('\\S+/$', function(req, res) {
//     return res.redirect(
//       301,
//       req.path.slice(0, -1) + req.url.slice(req.path.length)
//     )
//   })
//   /* eslint-enable */
//
//   server.get('*', (req, res) => {
//     return handle(req, res)
//   })
//
//   if (dev) {
//     server.listen(3000, err => {
//       if (err) {
//         console.log(err)
//         throw err
//       }
//       console.log('You can view the app in the browser:')
//       console.log()
//       console.log('Local:               http://localhost:3000')
//       console.log(`On Your Network:     http://${address.ip()}:3000`)
//       console.log()
//       console.log('Note that the development build is not optimized.')
//       console.log('To create a production build, use npm run build')
//     })
//   } else {
//     server.listen(8080, err => {
//       if (err) throw err
//       const CLEAR_CONSOLE = '\x1Bc'
//       const GREEN_TEXT = '\x1b[32m'
//       const BLACK_TEXT = '\x1b[30m'
//       const RESET_TEXT = '\x1b[0m'
//       const GREEN_BG = '\x1b[42m'
//       const TEXT_TITLE = `${GREEN_BG}${BLACK_TEXT} DONE ${RESET_TEXT}`
//       const TEXT_SUBTITLE = `${GREEN_TEXT}Compiled Successfully${RESET_TEXT}`
//
//       process.stdout.write(CLEAR_CONSOLE)
//       console.log(TEXT_TITLE + ' ' + TEXT_SUBTITLE)
//       console.log()
//       console.log('You can view the app in the browser:')
//       console.log()
//       console.log('Local:               http://localhost:8080')
//       console.log(`On Your Network:     http://${address.ip()}:8080`)
//     })
//   }
// })
//
// /*
//  * NB: make sure to modify this to take into account anything that should trigger
//  */
// function getCacheKey (req) {
//   return `${req.url}`
// }
//
// function renderAndCache (req, res, pagePath, queryParams) {
//   const key = getCacheKey(req)
//
//   // If we have a page in the cache, let's serve it
//   if (ssrCache.has(key)) {
//     // Enable to track cache logging
//     // console.log(`CACHE HIT: ${key}`)
//     res.send(ssrCache.get(key))
//     return
//   }
//
//   // If not let's render the page into HTML
//   app
//     .renderToHTML(req, res, pagePath, queryParams)
//     .then(html => {
//       // Let's cache this page
//       // Enable to track cache logging
//       // console.log(`CACHE MISS: ${key}`)
//       ssrCache.set(key, html)
//
//       res.send(html)
//     })
//     .catch(err => {
//       app.renderError(err, req, res, pagePath, queryParams)
//     })
// }
