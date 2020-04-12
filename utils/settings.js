const fs = require('fs')
const path = require('path')

// If there is a file at config.json,
// then read it and return it
// const config = fs.readFileSync(path.resolve(__dirname, '../config/config.json'))
// const keys = fs.readFileSync(path.resolve(__dirname, '../config/keys.json'))

let config
let keys

try {
  config = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../config/config.json'))
  )
} catch (error) {
  //
}

try {
  keys = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '../config/keys.json'))
  )
} catch (error) {
  //
}

// Export the configuration file
module.exports = { ...config, ...keys }
