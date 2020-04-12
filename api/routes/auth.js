const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const passport = require('passport')
require('../../config/passport')(passport)
const User = require('../models/User')
const config = require('../../utils/settings')
const {
  OK,
  NOT_FOUND,
  UNAUTHORIZED,
  BAD_REQUEST,
  CONFLICT
} = require('../../utils/statusCodes')

router.post('/edit', (req, res) => {
  // Strip JWT from the token
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')
  const query = { email: req.body.username }
  const user = {
    ...req.body
  }

  // Remove the auth token from the form getting edited
  delete user.username
  delete user.token
  delete user.password // don't allow password updates

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      // Build this out to search for a user
      if (!query.username) query.username = decoded.username
      User.updateOne(query, { ...user }, function (error, result) {
        if (error) {
          return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
        }

        if (result.nModified < 1) {
          return res
            .status(NOT_FOUND)
            .send({ message: `${req.body.username} not found.` })
        }

        return res
          .status(OK)
          .send({ message: `${req.body.username} was updated.` })
      })
    }
  })
})

router.post('/updatePassword', (req, res) => {
  // Strip JWT from the token
  if (!req.body.token || !req.body.password) return res.sendStatus(BAD_REQUEST)

  const token = req.body.token.replace(/^JWT\s/, '')
  const query = { username: req.body.username }
  const password = req.body.password

  const testPassword = testPasswordStrength(password)

  // If it doesnt meet the policy, return a BAD_REQUEST
  if (!testPassword.success) {
    // Bad Request
    return res.status(BAD_REQUEST).send({ message: testPassword.message })
  }

  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      // Build this out to search for a user
      if (!query.username) query.username = decoded.username

      User.findOne(
        {
          ...query
        },
        function (error, user) {
          if (error) {
            // Bad Request
            return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
          }

          if (!user) {
            // Unauthorized if the email does not match any records in the database
            res.status(404).send({ message: 'User not found.' })
          } else {
            user.password = password
            user.save(function (error) {
              if (error) {
                // Confict
                res.sendStatus(CONFLICT)
              } else {
                // Ok
                res.sendStatus(OK)
              }
            })
          }
        }
      )
    }
  })
})

// Registers a new user if the username is unique
// @parameter username: String
// @parameter password: String
// @return statusCode
router.post('/register', function (req, res) {
  // If the username, email or password isn't supplied, return a BAD_REQUEST
  if (!req.body.username || !req.body.password) {
    return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
  }

  // Create a new user with the supplied username and password
  if (req.body.username && req.body.password) {
    const newUser = new User({
      username: req.body.username,
      password: req.body.password
    })

    // Test the password to ensure the password policy
    // is enforced
    const testPassword = testPasswordStrength(req.body.password)

    // If it doesnt meet the policy, retrun a BAD_REQUEST
    if (!testPassword.success) {
      // Bad Request
      return res.status(BAD_REQUEST).send({ message: testPassword.message })
    }

    // Otherwise try to save the user to the database
    newUser.save(function (error) {
      if (error) {
        // Confict because another user with that username exists
        res.status(CONFLICT).send({ message: 'Username already exists.' })
      } else {
        // Ok
        res.sendStatus(OK)
      }
    })
  }
})

// Logs the user in if the password and username match the database
// @parameter email: String
// @paratmeter password: String
// @return: statusCode & JWT token
router.post('/login', function (req, res) {
  // If the email or password isn't supplied, return a BAD_REQUEST
  if (!req.body.username || !req.body.password) {
    return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
  }

  // Try and find a user in the database
  User.findOne(
    {
      username: req.body.username
    },
    function (error, user) {
      if (error) {
        // Bad Request
        return res.status(BAD_REQUEST).send({ message: 'Bad Request.' })
      }

      if (!user) {
        // Unauthorized if the email does not match any records in the database
        res
          .status(UNAUTHORIZED)
          .send({ message: 'Email or password does not match our records.' })
      } else {
        // Check if the last login attempt is less than 15 minutes from now
        // If so:
        // Check if the user is locked out (e.g. user.loginAttempts >= 5)
        // If so, return a 400 error w/ message Too many login attempts. Try again later.
        const FIFTEEN_MINUTES = 15 * 60 * 1000
        if (
          user.lastLoginAttempt &&
          new Date() - user.lastLoginAttempt < FIFTEEN_MINUTES
        ) {
          if (user.loginAttempts >= 5) {
            return res
              .status(UNAUTHORIZED)
              .send({ message: 'Too many login attempts. Try again later.' })
          }
        }

        // Check if password matches database
        user.comparePassword(req.body.password, function (error, isMatch) {
          if (isMatch && !error) {
            // If the email and password matches the database, assign and
            // return a jwt token

            // Set the expiration time
            const jwtOptions = {
              expiresIn: req.body.remember ? '7d' : '4h' // 7 days or 4 hours
            }

            // Data to be passed to the token stored in Local Storage
            const userToBeSigned = {
              username: user.username,
              lastLogin: user.lastLogin
            }

            // Reset the loginAttempts to 0
            user.loginAttempts = 0
            user.lastLogin = new Date()
            user.save(error => {
              if (error) console.log(error)
            })

            // Sign the token using the data provided above, the secretKey and JWT options
            const token = jwt.sign(userToBeSigned, config.secretKey, jwtOptions)
            res
              .status(OK)
              .send({ token: 'JWT ' + token, lastLogin: user.lastLogin })
          } else {
            // Failed login attempt
            // Increment loginAttempts by 1
            // Set lastLoginAttempt to now
            user.loginAttempts += 1
            user.lastLoginAttempt = new Date()

            user.save(error => {
              if (error) console.log(error)
            })

            // Unauthorized
            res.status(UNAUTHORIZED).send({
              message: 'Email or password does not match our records.'
            })
          }
        })
      }
    }
  )
})

// Verifies the users session if they have an active jwtToken.
// Used on the inital load of root '/'
// @parameter token: String
// @return: statusCode
router.post('/verify', function (req, res) {
  // If no token provided, then return a BAD_REQUEST
  if (!req.body.token) return res.sendStatus(BAD_REQUEST)

  // Strip JWT from the token
  const token = req.body.token.replace(/^JWT\s/, '')

  // Try and verify the token
  jwt.verify(token, config.secretKey, function (error, decoded) {
    if (error) {
      // Unauthorized
      res.sendStatus(UNAUTHORIZED)
    } else {
      // Ok
      res.status(OK).send(decoded)
    }
  })
})

// Helpers to test the passwordStrength according to the policy
function testPasswordStrength (password) {
  const passwordStrength = config.passwordStrength || 'strong'
  /* eslint-disable */
  const strongRegex = new RegExp(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'
  )
  const strongMessage =
    'Invalid password. Requires 1 uppercase, 1 lowercase, 1 number and 1 special character: !@#$%^&'

  const mediumRegex = new RegExp(
    '^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})'
  )
  const mediumMessage =
    'invalid password. Requires 1 uppercase or lowercase and 1 number'
  /* eslint-enable */

  // test the password against the strong regex & return true if it passes
  if (passwordStrength === 'strong') {
    return { success: strongRegex.test(password), message: strongMessage }
  }

  // test medium password by default
  return { success: mediumRegex.test(password), message: mediumMessage }
}

module.exports = router
