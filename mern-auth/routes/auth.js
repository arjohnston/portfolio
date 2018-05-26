const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const User = require('../models/user')
const config = require('../config/config')

// Registers a new user if the username is unique
router.post('/register', function (req, res) {
  if (req.body.username && req.body.password) {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })

    let testPassword = testPasswordStrength(req.body.password)

    if (!testPassword.success) {
      // Bad Request
      return res.status(400).send({ message: testPassword.message })
    }

    newUser.save(function (error) {
      if (error) {
        // Confict
        res.status(409).send({ message: 'Username already exists.' })
      } else {
        // Ok
        res.sendStatus(200)
      }
    })
  }
})

// Logs the user in if the password and username match the database
router.post('/login', function (req, res) {
  User.findOne({
    username: req.body.username
  }, function (error, user) {
    if (error) {
      // Bad Request
      return res.status(400).send({ message: 'Bad Request.' })
    }

    if (!user) {
      // Unauthorized if the username does not match any records in the database
      res.status(401).send({ message: 'Username or password does not match our records.' })
    } else {
      // Check if password matches database
      user.comparePassword(req.body.password, function (error, isMatch) {
        if (isMatch && !error) {
          // If the username and password matches the database, assign and
          // return a jwt token
          const jwtOptions = {
            expiresIn: '2h'
          }
          let token = jwt.sign(user.toJSON(), config.secretKey, jwtOptions)
          res.status(200).send({ token: 'JWT ' + token })
        } else {
          // Unauthorized
          res.status(401).send({ message: 'Username or password does not match our records.' })
        }
      })
    }
  })
})

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
router.post('/verify', function (req, res) {
  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(401)
    } else {
      // Ok
      res.sendStatus(200)
    }
  })
})

// Helpers
function testPasswordStrength (password) {
  const passwordStrength = config.passwordStrength || 'strong'
  /* eslint-disable */
  const strongRegex = new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})')
  const mediumRegex = new RegExp('^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})')
  const strongMessage = 'Invalid password. Requires 1 uppercase, 1 lowercase, 1 number and 1 special character: !@#\$%\^&'
  const mediumMessage = 'invalid password. Requires 1 uppercase or lowercase and 1 number'
  /* eslint-enable */

  // test the password against the strong regex & return true if it passes
  if (passwordStrength === 'strong') return { success: strongRegex.test(password), message: strongMessage }

  // test medium password by default
  return { success: mediumRegex.test(password), message: mediumMessage }
}

module.exports = router
