const formatOutput = require('./formatOutput')
const createConfigFile = require('./createConfigFile')
const createKeyFile = require('./createKeyFile')

module.exports = async () => {
  try {
    const configFile = require('../settings')

    if (
      configFile.secretKey !== null &&
      configFile.secretKey !== undefined &&
      configFile.passwordStrength !== null &&
      configFile.passwordStrength !== undefined
    ) {
      console.log(
        formatOutput('The configuration file exists and is valid.', 'success')
      )
    } else {
      console.log(
        formatOutput(
          'The configuration file does not have the required fields.',
          'warn'
        )
      )

      await createConfigFile()
    }
  } catch (error) {
    console.log(error)
    console.log(formatOutput('The configuration file does not exist.', 'warn'))

    await createConfigFile()
  }

  try {
    require('../../config/keys.json')

    console.log(formatOutput('The keys config file exists.', 'success'))
  } catch (error) {
    console.log(formatOutput('The keys config file does not exist.', 'warn'))

    await createKeyFile()
  }

  console.log()
}
