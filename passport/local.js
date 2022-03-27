const localStrategy = require("passport-local").Strategy
const bcrypt = require("bcrypt")

const userModel = require("../models/user")

let passportConfig = {
    usernameField : "userId",
    passwordField : "password",
    session : false
}

module.exports = new localStrategy(passportConfig, async (userId, password, done) => {
    try{
        const user = await userModel.findOne({userId}).exec()
        if(!user) return done(null, false, {message : '존재하지 않는 사용자입니다'})
        if(!bcrypt.compareSync(password, user.password)) return done(null, false, {message : '비밀번호가 잘못되었습니다'})
        return done(null, user)
    }catch(e){
        console.log(e)
        done(e)
    }
})  