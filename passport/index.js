const passport = require('passport')
const localS = require('./local')
passport.use('login', localS)

module.exports = passport
