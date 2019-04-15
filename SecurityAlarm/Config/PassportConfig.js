const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../Models/UserModel')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

/**
 * JWT Strategy for passport package
*/
passport.use(new LocalStrategy(
  async function (username, password, doneCB) {
    let user = await UserModel.findOne({ Username: username })

    if (!user) {
      return doneCB(null, false, { message: 'Incorrect email or password.' })
    }
    user.AuthenticatePassword(password, (e, res) => {
      if (!res) { return doneCB(null, false, {}) } else { return doneCB(null, user) }
    })
  }
))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
},
function (JWT, cb) {
  return UserModel.findOne({ Username: JWT.user })
    .then(user => {
      return cb(null, user)
    })
}
))
