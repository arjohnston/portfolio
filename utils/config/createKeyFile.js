const fs = require('fs')
const path = require('path')
const formatOutput = require('./formatOutput')

module.exports = () => {
  return new Promise((resolve, reject) => {
    // The configuration that the keys.js will be generated from
    const config = {
      google: {
        analytics: {
          TRACKING_ID: 'UA-XXXXXXXX-X'
        },
        recaptcha: {
          SECRET_KEY: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          CLIENT_KEY:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX-XXXXXXXXXXXXXXXXXX'
        },
        contact_form: {
          CLIENT_SECRET: 'XXXXXXXXXXXXXXXXXXXXXXXX',
          CLIENT_ID:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
          REDIRECT_URIS: ['https://developers.google.com/oauthplayground'],
          USER: 'admin@example.com',
          RECIPIENT: 'recipient@example.com',
          REFRESH_TOKEN:
            'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
        }
      }
    }

    console.log('Creating the keys file...')

    // Try to write a file to the config.file
    fs.writeFile(
      path.join(__dirname, '../../config/keys.json'),
      JSON.stringify(config, null, 2),
      (error, result) => {
        if (error) return reject(new Error(error))

        console.log(
          formatOutput(
            'Successfully created the keys configuration file.',
            'success'
          )
        )

        // Resolve the promise
        resolve()
      }
    )
  })
}
