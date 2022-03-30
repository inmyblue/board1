const express = require('express')
const router = express.Router()
const moment = require('moment')

// Model
const Article = require('../models/article')
const userModel = require('../models/user')

//Middleware
const articleValidation = require('../models/validations/articleValidation')
const sanitizer = require('../models/validations/sanitizehtml')
const authMiddleware = require('../middlewares/authmiddleware')

/*
    게시글 리스트 페이지 렌더링
    datetime 내림차순으로 정렬
    response : articles
*/
router.get('/', async (req, res) => {
	const articles = await Article.find().sort({ datetime: -1 })
	res.status(200).render('board', { articles })
})

/*
    게시글작성 페이지 렌더링
    사용자 인증거쳐서 적합한 사용자만 접근가능
    response : userNo, nickName
*/

router.get('/write', authMiddleware, async (req, res) => {
	const { user, authResult } = res.locals
	if (authResult !== '00')
		return res.send(
			"<script>alert('로그인한 사용자만 들어올수 있어요'); location.href='/user';</script>"
		)

	res.render('write', { userNo: user.userNo, nickName: user.nickName })
})

router.get('/write/:articleId', authMiddleware, async (req, res) => {
	const { user, authResult } = res.locals
	const { articleId } = req.params
	if (authResult !== '00')
		return res.send(
			"<script>alert('로그인한 사용자만 들어올수 있어요'); location.href='/user';</script>"
		)

	const article = await Article.findOne({
		articleId: Number(articleId),
		userNo: Number(user.userNo),
	})
	if (article)
		res.render('write', {
			article,
			userNo: user.userNo,
			nickName: user.nickName,
		})
	else
		return res.send(
			"<script>alert('수정은 작성자만 가능합니다'); location.href='/board';</script>"
		)
})

router.post(
	'/write',
	sanitizer.sanitizer,
	articleValidation.articlePost,
	authMiddleware,
	async (req, res) => {
		// 게시글 작성하기
		const { title, content, nickName, userNo } = req.body
		const datetime = moment().format('YYYY-MM-DD HH:mm:ss')
		const {authResult, user} = res.locals

		if(authResult != "00") return res.status(401).json({msg : "막았지롱!!"})

		const createArticle = await Article.create({
			title,
			content,
			nickName,
			userNo: Number(userNo),
			datetime,
		})

		res.status(201).json({ success: true, msg: '작성이 완료되었습니다' })
	}
)

router.put(
	'/write/:articleId',
	authMiddleware,
	articleValidation.articlePost,
	async (req, res) => {
		const { authResult } = res.locals
		if (authResult !== '00')
			return res
				.status(401)
				.json({ msg: '로그인정보가 올바르지 않습니다' })
		const { articleId } = req.params
		const { title, content, userNo } = req.body
		const datetime = moment().format('YYYY-MM-DD HH:mm:ss')

		await Article.updateOne(
			{ articleId: Number(articleId), userNo: Number(userNo) },
			{ $set: { title, content, datetime } }
		)
		return res.status(201).json({ msg: '수정이 완료되었습니다' })
	}
)

router.post(
	'/comment',
	sanitizer.sanitizerComment,
	articleValidation.commentPost,
	authMiddleware,
	async (req, res) => {
		const { user, authResult } = res.locals
		const { articleId, content } = req.body
		const datetime = moment().format('YYYY-MM-DD HH:mm:ss')

		if (authResult !== '00') return res.status(401).send()

		const commentWrite = await Article.updateOne(
			{ articleId: Number(articleId) },
			{
				$push: {
					comments: {
						nickName: user.nickName,
						userNo: Number(user.userNo),
						content,
						datetime,
					},
				},
			}
		).exec()

		res.status(201).json({ msg: '댓글등록이 완료되었습니다' })
	}
)

router.patch(
	'/comment',
	articleValidation.commentUpdate,
	authMiddleware,
	async (req, res) => {
		const { articleId, commentId, content } = req.body
		const { authResult } = res.locals

		if (authResult !== '00')
			return res
				.status(401)
				.json({ msg: '로그인정보가 올바르지 않습니다' })
		Article.findOne(
			{ articleId: Number(articleId) },
			function (err, result) {
				result.comments.id(commentId).content = content
				result.save()
			}
		)

		res.json({ msg: '댓글수정이 완료되었습니다' })
	}
)

router.delete('/comment', authMiddleware, async (req, res) => {
	const { articleId, commentId } = req.body
	try {
		Article.findOne(
			{ articleId: Number(articleId), 'comments._id': commentId },
			function (err, result) {
				result.comments.id(commentId).remove()
				result.save()
			}
		)
		return res.json({ msg: '삭제가 완료되었습니다' })
	} catch (e) {
		console.log(e)
		return res
			.status(400)
			.json({ msg: '댓글 작성자가 본인인지 확ㅋ인해주세요' })
	}
})

router.get('/:articleId', authMiddleware, async (req, res) => {
	// 게시글 상세페이지
	const authResult = res.locals.authResult
	const { articleId } = req.params
	const article = await Article.findOne({
		articleId: Number(articleId),
	}).exec()
	let user = { userNo: '', nickName: '', liked: '' }

	if (authResult === '11')
		res.send(
			"<script>alert('로그인 정보가 잘못되었어요'); location.href='/board';</script>"
		)
	if (authResult === '00') user = res.locals.user

	res.render('detail', {
		article,
		userNo: user.userNo,
		nickName: user.nickName,
	})
})

router.delete('/:articleId', authMiddleware, async (req, res) => {
	const { user } = res.locals
	const { articleId } = req.params
	try {
		await Article.deleteOne({
			articleId: Number(articleId),
			userNo: user.userNo,
		}).exec()
		return res.status(201).json({ msg: '삭제가 완료되었습니다' })
	} catch (e) {
		console.log(e)
		return res
			.status(400)
			.json({ msg: '글의 작성자가 본인이 맞는지 확인해주세요' })
	}
})

router.patch('/like', authMiddleware, async (req, res) => {
	const { articleId, userNo } = req.body
	const { authResult } = res.locals

	if(authResult !== "00") return res.json({"msg" : '누구냐 너'})

	const {user} = res.locals
	

	try {
		const chk = await Article.findOne({
			articleId: Number(articleId),
			userNo: Number(userNo),
		}).exec()
		if (chk) return res.json({ msg: '본인 글은 추천할 수 없습니다' })

		if(!userChk) return res.json({msg : ''})
		await userModel
			.updateOne(
				{ userNo: Number(userNo) },
				{ $push: { liked: Number(articleId) } }
			)
			.exec()
		await Article.updateOne(
			{ articleId: Number(articleId) },
			{ $inc: { likes: 1 }, $push: { liked: Number(userNo) } }
		).exec()
		return res.status(201).json({ msg: '추천완료' })
	} catch (e) {
		console.log(e)
	}
})

router.patch('/unlike', authMiddleware,  async (req, res) => {
	const { articleId, userNo } = req.body
	const {authResult} = res.locals

	if(authResult !== "00") return res.json({"msg" : "누구냐 너"})
	try {
		await userModel
			.updateOne(
				{ userNo: Number(userNo) },
				{ $pull: { liked: Number(articleId) } }
			)
			.exec()
		await Article.updateOne(
			{ articleId: Number(articleId) },
			{ $inc: { likes: -1 }, $pull: { liked: Number(userNo) } }
		).exec()
		return res.status(201).json({ msg: '추천취소완료' })
	} catch (e) {
		console.log(e)
	}
})

module.exports = router
