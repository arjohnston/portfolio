// Abstract: Set up all required dependencies and setup mongodb
// To run: node setup.js
// Arguments:
// --verbose: (e.g. `node setup.js --verbose`): Prints outputs of each command ran
// --manual: (e.g. `node setup.js --manual`): Prints list of dependencies to be manually installed
// --weak, --medium: (e.g. `node setup.js --weak`): Sets the password strength policy to Weak
// --help: (e.g. `node setup.js --help`): Prints a list of available commands
// Multiple commands can be used together (e.g. `node setup.js --verbose weak`)

const cp = require('child_process')
const fs = require('fs')

const args = process.argv
const options = {
  verbose: false,
  passwordStrength: 'strong'
}

function checkArgs () {
  if (process.platform === 'win32') {
    console.log('Unfortunately Windows requires manual installation of the dependencies\n')

    printListOfDependencies()
    createConfigFile()

    return
  }

  if (args.toString().toLowerCase().includes('verbose')) {
    // If verbose logging is requested, enable verbose logging
    options.verbose = true
  }

  if (args.toString().toLowerCase().includes('manual')) {
    printListOfDependencies()

    createConfigFile()

    return
  }

  if (args.toString().toLowerCase().includes('medium')) {
    options.passwordStrength = 'medium'
  }

  if (args.toString().toLowerCase().includes('weak')) {
    options.passwordStrength = 'weak'
  }

  if (args.toString().toLowerCase().includes('help')) {
    help()

    return
  }

  setup()
}

function printListOfDependencies () {
  console.log('Required dependencies:')
  console.log(formatOutput('NodeJS ', 'warn'), 'The Javascript engine used to power the app')
  console.log(formatOutput('NPM ', 'warn'), 'Package manager for installing Node modules')
  console.log(formatOutput('PM2 ', 'warn'), 'The process manager to spawn the daemons')
  console.log(formatOutput('Brew ', 'warn'), 'System package manager to install mongo')
  console.log(formatOutput('MongoDB ', 'warn'), 'The database used')
  console.log()
  console.log('Once each of the depedencies are installed, the database will need\nto be configured according to your operating system')
  console.log()
}

function help () {
  console.log('Available arguments:')
  console.log('--verbose: (e.g. `node setup.js --verbose`): Prints outputs of each command ran')
  console.log('--manual: (e.g. `node setup.js --manual`): Prints list of dependencies to be manually installed')
  console.log('--weak, --medium: (e.g. `node setup.js --weak`): Sets the password strength policy to Weak')
  console.log('--help: (e.g. `node setup.js --help`): Prints a list of available commands')
  console.log('Multiple commands can be used together (e.g. `node setup.js --verbose weak`)\n')

  console.log('Using the below policy definitions, select which password policy should be enforced (default Strong)')
  console.log('Strong (default):')
  console.log('\tContains at least 1 lowercase alphabetical character')
  console.log('\tContains at least 1 uppercase alphabetical character')
  console.log('\tContains at least 1 numeric character')
  console.log('\tContains at least one special character: !@#\\$%^&')
  console.log('\tThe string must be at least eight characters or longer')
  console.log()

  console.log('Medium (pass --medium to the arguments (e.g. `node setup.js --medium`)):')
  console.log('\tContains at least 1 lowercase alphabetical character and at least 1 uppercase alphabetical character; or')
  console.log('\tContains at least one lowercase alphabetical character and at least 1 numeric character; or')
  console.log('\tContains at least one uppercase alphabetical character and at least 1 numeric character')
  console.log('\tThe string must be at least six characters or longer')
  console.log()

  console.log('Weak (pass --weak to the arguments (e.g. `node setup.js --weak`)):')
  console.log('\tNo restrictions')
  console.log()
}

function runChildProcessExec (cmd, msg) {
  if (!cmd) return

  console.log(msg)

  return new Promise((resolve, reject) => {
    cp.exec(cmd, function (error, stdout, stderr) {
      if (error) {
        reject(new Error(error))
      } else {
        if (stderr && options.verbose) console.log(stderr)
        if (stdout && options.verbose) console.log(stdout)
        resolve()
      }
    })
  })
}

function createConfigFile () {
  function createSecretKey () {
    const chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
    let result = ''

    for (let i = 64; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]

    return result
  }

  // secretKey is used to generate a unique jwtToken
  // This key should be changed from it's default to a mix of
  // random characters, numbers and symbols. At least 25 characters long
  // To generate a random key, visit https://www.lastpass.com/password-generator
  const jwtSecretKey = createSecretKey()

  const config = {
    secretKey: jwtSecretKey,
    passwordStrength: options.passwordStrength
  }

  console.log('Creating the configuration file...')

  return new Promise((resolve, reject) => {
    fs.writeFile('../api/config/config.json', JSON.stringify(config, null, 2), (error, result) => {
      if (error) reject(new Error(error))

      console.log(formatOutput('Successfully created the configuration file\n', 'success'))

      resolve()
    })
  })
}

function setup () {
  // Check if NPM is successfully installed
  runChildProcessExec('npm -v', 'Checking if NPM is installed')
    .then(() => {
      console.log(formatOutput('NPM is installed\n', 'success'))

      // Check if Brew is installed
      return runChildProcessExec('brew -v', 'Checking if Brew is installed')
    })
    .then(() => {
      console.log(formatOutput('Brew is installed\n', 'success'))

      // Set up node_modules
      // Dependency: Node & NPM
      return runChildProcessExec('npm install', 'Setting up dependencies...')
    })
    .then(() => {
      console.log(formatOutput('Successfully installed node_modules\n', 'success'))

      // Upgrade and update brew in preparation for installing MongoDB
      // Dependency: Homebrew
      return runChildProcessExec('brew update && brew upgrade', 'Upgrading brew...')
    })
    .then(() => {
      console.log(formatOutput('Successfully upgraded brew\n', 'success'))

      // Install MongoDB
      // Dependency: brew
      return runChildProcessExec('brew tap mongodb/brew && brew install mongodb-community', 'Installing MongoDB...')
    })
    .then(() => {
      console.log(formatOutput('Successfully installed MongoDB\n', 'success'))

      // Install PM2
      // Dependency: NPM
      return runChildProcessExec('npm i pm2 -g', 'Installing PM2...')
    })
    .then(() => {
      console.log(formatOutput('Successfully installed PM2\n', 'success'))

      // Set up the database & adjust the user
      // Feature request: remove necessity of using sudo
      return runChildProcessExec('sudo mkdir -p /data/db && sudo chown -R `id -un` /data/db', 'Setting up database at /data/db/, pwd needed for sudo:')
    })
    .then(() => {
      console.log(formatOutput('Successfully set up the database & permissions\n', 'success'))

      return createConfigFile()
    })
    .then(() => {
      console.log(formatOutput('Utilized `sudo` to set up permissions. It\'s recommended to set up a group for security reasons.\n', 'warn'))
      console.log()
      console.log('To start the processes use \x1b[32mnpm run pm2-start\x1b[0m')
      console.log('To stop the processes use  \x1b[32mnpm run pm2-stop\x1b[0m')
    })
    .catch((err) => console.log(formatOutput(`An error was encountered. Try manually installing the last dependency.\n${err}`, 'error')))
}

// Format the text of a message to be outputed into a terminal (tested on MacOS iTerm2)
// @parameter msg: string
// @parameter type: string (success, warn, error)
function formatOutput (msg, type = 'success') {
  const RED_TEXT = '\x1b[31m'
  const GREEN_TEXT = '\x1b[32m'
  const YELLOW_TEXT = '\x1b[33m'
  const RESET_TEXT = '\x1b[0m' // Reset is required to return the text color back to normal
  const CHECK_MARK = '\u2714'
  const CROSS = '\u274c'

  switch (type) {
    case 'success':
      // String with a check mark and green text
      return `${GREEN_TEXT}${CHECK_MARK}  ${msg}${RESET_TEXT}`

    case 'warn':
      // String with yellow text
      return `${YELLOW_TEXT}${msg}${RESET_TEXT}`

    case 'error':
      // String with cross and red text
      return `${RED_TEXT}${CROSS}  ${msg}${RESET_TEXT}`

    default:
      // Return the default string if unknown
      return msg
  }
}

checkArgs()
