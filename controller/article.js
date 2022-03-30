const articleService = require('../services/articleService')
const userService = require('../services/userService')
const Article = require('../models/article')
const userModel = require('../models/user')

module.exports = {
	//게시글 리스트 렌더링
	boardRender : async (req, res) =>{
		const articles = await articleService.getArticlesLists('datetime', -1)
		res.status(200).render('board', { articles })
	},
	writeRender : async (req, res) => {
		const { user, authResult } = res.locals
		const auth = await articleService.authChkRender(authResult)
		if(auth != true)
			res.send(auth)
		res.render('write', { userNo: user.userNo, nickName: user.nickName })
	},
	updateRender : async (req, res) => {
		const { user, authResult } = res.locals
		const { articleId } = req.params
		const { userNo, nickName } = user
		const auth = await articleService.authChkRender(authResult)
		if(auth != true)
			res.send(auth)

		const article = await articleService.articleChk(articleId, userNo)
		if (article)
			res.render('write', {
				article,
				userNo,
				nickName,
			})
		else
			return res.send(
				"<script>alert('수정은 작성자만 가능합니다'); location.href='/board';</script>"
			)
	},
	writePost : async (req, res) => {
		const { title, content} = req.body
		const {authResult, user} = res.locals
		const userNo = user.userNo
		const nickName = user.nickName

		if(authResult !== "00") 
			return res.status(401).json({msg : "로그인 없이 이용할 수 없습니다"})

		const chk = await userService.userNoChk( userNo )
		if(!chk) 
			return res.status(401).json({msg : "유효한 사용자가 아닙니다"})

		await articleService.createArticle(title, content, nickName, userNo)

		res.status(201).json({ msg: '작성이 완료되었습니다' })
	},
	writeUpdate : async (req, res) => {
		const { authResult, user } = res.locals
		if (authResult !== '00')
			return res.status(401).json({ msg: '로그인정보가 올바르지 않습니다' })
		const { articleId } = req.params
		const { title, content } = req.body
		const userNo = user.userNo

		await articleService.updateArticle(articleId, title, content, userNo)
		return res.status(201).json({ msg: '수정이 완료되었습니다' })
	},
	boardDelete : async (req, res) => {
		const { user, authResult } = res.locals
		if (authResult !== '00')
			return res.status(401).json({ msg: '로그인정보가 올바르지 않습니다' })

		const { articleId } = req.params
		const userNo = user.userNo
		if(!articleService.articleChk(articleId, userNo))
			return res.status(401).json({ msg: '글의 작성자가 본인이 맞는지 확인해주세요'})

		await articleService.deleteArticle(articleId)
		return res.status(201).json({ msg: '삭제가 완료되었습니다' })
	},
	boardList : async (req, res) => {
		const {authResult, user} = res.locals
		const { articleId } = req.params
		const article = await articleService.articleData(articleId)
		const userNo = user.userNo
		const nickName = user.nickName

		if (authResult === '11')
			return res.send(
				"<script>alert('로그인 정보가 잘못되었어요'); location.href='/user';</script>"
			)
		res.render('detail', {
			article,
			userNo,
			nickName,
		})
	},
	likeDo : async (req, res) => {
		const { articleId } = req.body
		const { authResult, user } = res.locals

		if(authResult !== "00") return res.status(401).json({"msg" : '로그인한 사용자만 이용할 수 있습니다'})
		
		const userNo = user.userNo
		const userChk = await userService.userNoChk(userNo)

		if(!userChk) return res.status(401).json({msg : '로그인정보가 올바르지 않습니다'})
		
		const chk = await articleService.articleChk(articleId, userNo)
		if (chk) return res.json({ msg: '본인 글은 추천할 수 없습니다' })

		await articleService.likeUpdate(articleId, userNo, 'like')
		return res.status(201).json({ msg: '추천완료' })
		
	},
	unlikeDo : async (req, res) => {
		const { articleId } = req.body
		const {authResult, user} = res.locals

		if(authResult !== "00") return res.status(401).json({"msg" : "로그인한 사용자만 이용할 수 있습니다"})
		
		const userNo = user.userNo
		const userChk = await userService.userNoChk(userNo)

		if(!userChk) return res.status(401).json({msg : '로그인정보가 올바르지 않습니다'})

		await articleService.likeUpdate(articleId, userNo, 'unlike')
		return res.status(201).json({ msg: '추천취소완료' })

	},
    commentPost : async (req, res) => {
        const { user, authResult } = res.locals
		const { articleId, content } = req.body

		if (authResult !== '00') return res.status(401).json({msg : '로그인된 사용자만 댓글을 입력할 수 있습니다'})
		const {userNo, nickName} = user
		const userChk = await userService.userNoChk(userNo)
		if(!userChk) return res.status(401).json({msg : '로그인정보가 올바르지 않습니다'})

		await articleService.createComment(articleId, nickName, userNo, content)

		res.status(201).json({ msg: '댓글등록이 완료되었습니다' })
    },
    commentUpdate : async (req, res) => {
        const { articleId, commentId, content } = req.body
		const { authResult, user } = res.locals

		if (authResult !== '00')
			return res
				.status(401)
				.json({ msg: '로그인정보가 올바르지 않습니다' })
		
		const {userNo, nickName} = user
		const userChk = await userService.userNoChk(userNo)
		if(!userChk) return res.status(401).json({msg : '로그인정보가 올바르지 않습니다'})

		await articleService.updateComment(articleId, userNo, commentId, content)

		res.json({ msg: '댓글수정이 완료되었습니다' })
    },
    commentDelete : async (req, res) => {
        const { articleId, commentId } = req.body
        const { authResult, user } = res.locals

        if(authResult !== "00")
			return res.status(401).json({msg : "로그인된 사용자만 가능합니다"})
        
		const userNo = user.userNo
		const userChk = await userService.userNoChk(userNo)
		if(!userChk) return res.status(401).json({msg : '로그인정보가 올바르지 않습니다'})

		await articleService.updateComment(articleId, userNo, commentId,)
		return res.json({ msg: '삭제가 완료되었습니다' })
	}
}