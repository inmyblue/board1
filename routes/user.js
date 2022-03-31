const express = require('express')
const router = express.Router()

const userCtl = require("../controller/user")
const authmiddleware = require('../middlewares/authmiddleware')
const userValidation = require('../models/validations/userValidation')

// 로그인 관련
/**
 * @swagger
 * /user:
 *   post:
 *    tags:
 *     - user
 *    description: 로그인 API
 *    produces:
 *     - application/json
 *    parameters:
 *     - name: userId
 *       in: body
 *       required: true
 *       description: 유저아이디
 *       schema:
 *        type: string
 *        format: email
 *     - name: password
 *       in: body
 *       required: true
 *       description: 비밀번호
 *       schema:
 *        type: string
 *        format: password
 *    response:
 *     201:
 *      description: 로그인 성공
 * /user/register:
 *   post:
 *    tags:
 *     - user
 *    description: 회원가입 API
 *    produces:
 *     - application/json
 *    parameters:
 *     - name: userId
 *       in: body
 *       required: true
 *       description: 사용하고자 하는 ID
 *       schema:
 *        type: string
 *        format: email
 *     - name: password
 *       in: body
 *       required: true
 *       description: 비밀번호
 *       schema:
 *        type: string
 *        foramt: password
 *     - name: confirmPassword
 *       in: body
 *       required: true
 *       description: ID 확인용 추가입력
 *       schema:
 *        type: string
 *        format: password
 *     - name: nickName
 *       in: body
 *       required: true
 *       description: 닉네임
 *       schema:
 *        type: string
 *    response:
 *     201:
 *      description: 회원가입 성공
 *     400:
 *      description: 입력값 오류
 *   
 *       
 */
router.get('/', userCtl.loginRender)
router.post('/', userValidation.userLogin, userCtl.login)

// 회원가입 관련
router.get('/register', userCtl.registerRender)
router.post('/register', userValidation.userPost, userCtl.register)

// 유저인증관련
router.get('/me', authmiddleware, userCtl.authorization)

module.exports = router