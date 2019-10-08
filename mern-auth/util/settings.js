const fs = require('fs')
const path = require('path')

const config = fs.readFileSync(path.resolve(__dirname, '../api/config/config.json'))

module.exports = JSON.parse(config)
