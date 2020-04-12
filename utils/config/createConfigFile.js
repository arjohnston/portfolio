const fs = require('fs')
const path = require('path')
const formatOutput = require('./formatOutput')

const options = {
  // Default strong password
  passwordStrength: 'strong'
}

module.exports = () => {
  // Utlity function to create a simple hash to be used as a
  // JWT secret key
  // @return: String
  function createSecretKey () {
    // All available characters to be included in the hash
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

    // Result of the hash
    let result = ''

    // Length of the hash to be returned
    const HASH_LENGTH = 64

    // For loop for the hash length, utilizing random numbers
    for (let i = HASH_LENGTH; i > 0; --i) {
      result += chars[Math.floor(Math.random() * chars.length)]
    }

    // Return the hash
    return result
  }

  return new Promise((resolve, reject) => {
    // secretKey is used to generate a unique jwtToken
    // This key should be changed from it's default to a mix of
    // random characters, numbers and symbols. At least 25 characters long
    // To generate a random key, visit https://www.lastpass.com/password-generator
    const jwtSecretKey = createSecretKey()

    // The configuration that the config.json will be generated from
    const config = {
      secretKey: jwtSecretKey,
      passwordStrength: options.passwordStrength
    }

    console.log('Creating the configuration file...')

    // Try to write a file to the config.file
    fs.writeFile(
      path.join(__dirname, '../../config/config.json'),
      JSON.stringify(config, null, 2),
      (error, result) => {
        if (error) return reject(new Error(error))

        console.log(
          formatOutput(
            'Successfully created the configuration file.',
            'success'
          )
        )

        // Resolve the promise
        resolve()
      }
    )
  })
}
