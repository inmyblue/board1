const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const moment = require("moment")
const jwt = require("jsonwebtoken")

const userModel = require("../models/user")
const userValidation = require("../models/validations/userValidation")
const passport = require("../passport/index")

const secretKey = process.env.SECRETKEY

router.get("/", (req, res) => {
    res.render("login")
})
router.get("/register", (req, res) => {
    res.render("register")
})

//회원가입 API
router.post("/register", userValidation.userPost, async (req, res) => {
    const { userId, nickName, password} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")
    const hashedPw = bcrypt.hashSync(password, 10)

    const existUser = await userModel.find({nickName}).exec()
    if(existUser.length){
        return res.status(400).send({"msg" : "이미 등록된 닉네임이 있습니다"})
    }

    const insertUser = new userModel({userId,nickName, password : hashedPw, datetime})
    await insertUser.save()
    
    res.status(201).send({"msg" : "회원가입이 완료되었습니다."})
})

//로그인 API
router.post("/", userValidation.userLogin, 
    passport.authenticate('login',{session:false}), async (req, res) => {
    const {user} = req
    const token = jwt.sign({
        userNo : user.userNo,
        nickName : user.nickName
    }, secretKey )
    res.send({token})
})

router.get("/me", passport.authenticate('jwt',{session:false}), async (req, res) => {
    const {user} = req
    res.send({userNo : user.userNo, nickName : user.nickName})
 })

module.exports = router