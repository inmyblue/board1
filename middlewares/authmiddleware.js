const userModel = require('../models/user')
const jwt = require('jsonwebtoken')

/*
00 : 로그인성공
10 : 쿠키없음 (로그인정보없음)
11 : 쿠키에 담겨있는 정보와 맞는 DB정보없음

res.locals.user : 로그인한 유저 정보 전달
*/
module.exports = async (req, res, next) => {
	try {
		if (!req.cookies.ggactk) {
			res.locals.authResult = '10'
			res.locals.user = ''
		} else {
			try {
				const { userNo, nickName } = jwt.verify(
					req.cookies.ggactk,
					process.env.SECRETKEY
				)
				const existUser = await userModel.findOne({
					userNo: Number(userNo),
					nickName,
				})
				if (!existUser) res.locals.authResult = '11'
				else {
					res.locals.user = existUser
					res.locals.authResult = '00'
				}
			} catch (e) {
				return res
					.status(401)
					.send({
						msg: '토큰이 유효하지 않습니다 다시 로그인해주세요',
						reason: 'tokenVerify',
					})
			}
		}
		next()
	} catch (e) {
		console.log(e)
		return
	}
}
