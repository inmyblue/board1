const bcrypt = require('bcrypt');
const res = require('express/lib/response');
const jwt = require('jsonwebtoken')
const moment = require('moment')

// Model
const userModel = require('../models/user')

// env load
require('dotenv').config();
const secretKey = process.env.SECRETKEY

// user 컬렉션에서 userId로 찾기
module.exports = {
    //로그인 관련 서비스로직
    userNoChk : async ( userNo ) => { //userNo가 user 컬렉션에 있는지 확인
        const chk = await userModel.findOne({userNo : Number(userNo)}).exec()
        return chk ? chk : false
    },
    userIdChk : async ( userId ) => { //userId가 user 컬렉션에 있는지 확인
        const chk = await userModel.findOne({userId}).exec()
        return chk ? chk : false
    },
    comparepwd : async ( password, dbpassword ) => { // 두 패스워드 bcrypt 비교
        const pwdChk = bcrypt.compareSync(password, dbpassword)
        return pwdChk ? pwdChk : false
    },
    tokenSign : async ( userNo, nickName ) => { // jwt token 발급
        const token = jwt.sign({
            userNo : userNo,
            nickName : nickName,
            expireIn : '2h'
        },
        secretKey
        )
        return token
    },
    // 회원가입 관련 서비스로직
    bcrypthash : ( password ) => { // 패스워드 해시암호화
        return bcrypt.hashSync(password, 10)
    },
    nowDate : () => { // 현재시간을 형식에 맞게 반환
        return moment().format('YYYY-MM-DD HH:mm:ss')
    },
    createUser : async ( userId, nickName, password) => { // user 생성
        const datetime = moment().format('YYYY-MM-DD HH:mm:ss')
        const createUser = new userModel({
            userId,
            nickName,
            password,
            datetime,
        })
        await createUser.save()
        return
    },
}