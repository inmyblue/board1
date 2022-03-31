const express = require('express')
const router = express.Router()

const userCtl = require("../controller/user")
const authmiddleware = require('../middlewares/authmiddleware')
const userValidation = require('../models/validations/userValidation')

router.get('/', userCtl.loginRender)
router.post('/', userValidation.userLogin, userCtl.login)

// 회원가입 관련
router.get('/register', userCtl.registerRender)
router.post('/register', userValidation.userPost, userCtl.register)

// 유저인증관련
router.get('/me', authmiddleware, userCtl.authorization)

module.exports = router