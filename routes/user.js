const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const moment = require("moment")
const jwt = require("jsonwebtoken")

const userModel = require("../models/user")
const userValidation = require("../models/validations/userValidation")
const passport = require("../passport/index")
const authmiddleware = require("../middlewares/authmiddleware")

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

    const existUser = await userModel.find({userId}).exec()
    if(existUser.length){
        return res.status(400).send({"msg" : "이미 등록된 ID가 있습니다"})
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
        nickName : user.nickName,
        expireIn : "2h"
    }, secretKey )
    res.send({token})
})

router.get("/me", authmiddleware, async (req, res) => {
    const {authResult} = res.locals
    res.status(200).json({authResult}) 
 })

module.exports = router