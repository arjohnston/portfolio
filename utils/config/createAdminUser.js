const User = require('../../api/models/User')
const formatOutput = require('./formatOutput')

module.exports = () => {
  User.find({}, (error, users) => {
    if (error) console.log(error)

    if (users.length > 0) return

    console.log('Creating an admin user...')

    const newUser = new User({
      username: 'admin',
      password: 'password'
    })

    // Otherwise try to save the user to the database
    newUser.save(function (error) {
      if (error) {
        // Confict because another user with that username exists
        console.log(formatOutput('Error creating admin account', 'error'))
      } else {
        // Ok
        console.log(formatOutput('Created an admin user.', 'success'))
        console.log(
          formatOutput('Login in to change the username and password.', 'warn')
        )
        console.log('Username:\tadmin')
        console.log('Password:\tpassword')
        console.log()
      }
    })
  })
}
