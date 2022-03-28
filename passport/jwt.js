const {Strategy:JWTStrategy, ExtractJwt} = require("passport-jwt")
const userModel = require("../models/user")

const jwtConfig = {
    jwtFromRequest : ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey : process.env.SECRETKEY
}

module.exports = new JWTStrategy(jwtConfig, async (payload, done) => {
    const {userId, userNo, nickName} = payload
    const user = await userModel.findOne({userId, nickName, userNo : Number(userNo)})
    if(!user) return done(null, false)
    return done(null, payload)
})