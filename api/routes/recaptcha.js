const express = require('express')
const router = express.Router()
const { OK } = require('../../utils/statusCodes')

const config = require('../../config/config')

require('es6-promise').polyfill()
require('isomorphic-fetch')

router.post('/api/recaptcha', (req, res) => {
  // Don't submit the API on DEV
  if (process.NODE_ENV === 'dev' || process.NODE_ENV === 'test') { return { result: 'DEV', status: OK } }

  if (req.body.key) {
    const url =
      'https://www.google.com/recaptcha/api/siteverify?secret=' +
      config.google.recaptcha.SECRET_KEY +
      '&response=' +
      req.body.key

    fetch(url, {
      method: 'POST'
    })
      .then(response => {
        if (response.status >= 200 && response.status < 300) {
          return response.json()
        } else {
          const error = new Error(response.statusText)
          error.response = response
          throw error
        }
      })
      .then(data => {
        res.status(OK).send({ result: data.success })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(err.response.status)
      })
  }
})

module.exports = router
