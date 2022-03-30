const userService = require('../services/userService')

module.exports = {
    //로그인 페이지 렌더링
    loginRender : (req, res) =>{ 
        res.render('login')
    },
    //회원가입 페이지 렌더링
    registerRender : (req, res) => {
        res.render('register')
    },
    // 로그인 API
    login : async (req, res) => {
        const { userId, password } = req.body

        const userChk = await userService.userIdChk(userId)      
        if(!userChk){
            return res.status(401).json({'msg' : "존재하지 않는 ID입니다"})
        }

        const pwdChk = await userService.comparepwd(password, userChk.password)
        if(!pwdChk){
            return res.status(401).json({'msg' : '비밀번호가 잘못되었습니다'})
        }

        const token = await userService.tokenSign(userChk.userNo, userChk.nickName)
		res.json({token})
	},
    // 회원가입 API
    register : async (req, res) => {
        const { userId, nickName, password } = req.body
        const hashedPw = await userService.bcrypthash(password)

        const userChk = await userService.userIdChk(userId)
        if (userChk) {
            return res.status(401).send({ msg: '이미 등록된 ID가 있습니다' })
        }

        await userService.createUser(
            userId, nickName, hashedPw
        )

        res.status(201).send({ msg: '회원가입이 완료되었습니다.' })
    },

    // 회원인증 API
    authorization : async (req, res) => {
        const { authResult } = res.locals
        res.json({ authResult })
    }
}