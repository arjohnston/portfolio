const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../config/passport')(passport)
const User = require('../models/user')
const config = require('../config/config')

// Registers a new user if the username is unique
// TODO: enforce stricter passwords
router.post('/register', function (req, res) {
  if (req.body.username && req.body.password) {
    let newUser = new User({
      username: req.body.username,
      password: req.body.password
    })

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
      return res.status(500).send({ message: 'Bad Request.' })
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

module.exports = router
