const passport = require("passport")
const localS = require('./local')
const jwtS = require('./jwt')

passport.use('login', localS)
passport.use('jwt',jwtS)

module.exports =passport