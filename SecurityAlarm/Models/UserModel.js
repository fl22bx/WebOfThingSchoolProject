const moongoose = require('mongoose')
const Schema = moongoose.Schema
const bcrypt = require('bcrypt-nodejs')

/**
 * Passport Schema
 */
let AuthenticationSchema = new Schema({
  Username: {
    type: String,
    unique: true
  },
  Password: String
})

AuthenticationSchema.pre('save', function (next) {
  let user = this
  bcrypt.genSalt(12, function (salt) {
    bcrypt.hash(user.Password, salt, null, function (e, hash) {
      if (e) { return next(e) }
      user.Password = hash
      return next()
    })
  })
})

AuthenticationSchema.methods.AuthenticatePassword = function (PostedPassword, cb) {
  let user = this

  bcrypt.compare(PostedPassword, user.Password, function (e, res) {
    if (e) {
      return cb(e, res)
    }

    return cb(null, res)
  })
}

module.exports = moongoose.model('AuthenticationModel', AuthenticationSchema)
