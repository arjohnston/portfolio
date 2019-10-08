const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')

const UserSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password: {
    type: String,
    required: true
  }
},
{ collection: 'User' }
)

UserSchema.pre('save', function (next) {
  const user = this
  if (this.isModified('password') || this.isNew) {
    bcrypt.genSalt(10, function (error, salt) {
      if (error) {
        return next(error)
      }

      bcrypt.hash(user.password, salt, null, function (error, hash) {
        if (error) {
          return next(error)
        }

        user.password = hash
        next()
      })
    })
  } else {
    return next()
  }
})

UserSchema.methods.comparePassword = function (passwd, callback) {
  bcrypt.compare(passwd, this.password, function (error, isMatch) {
    if (error) {
      return callback(error)
    }

    callback(null, isMatch)
  })
}

module.exports =
  mongoose.models && mongoose.models.User
    ? mongoose.models.User
    : mongoose.model('User', UserSchema)
