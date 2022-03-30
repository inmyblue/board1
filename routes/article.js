const express = require('express')
const router = express.Router()
const articleCtl = require("../controller/article")

const articleValidation = require('../models/validations/articleValidation')
const sanitizer = require('../models/validations/sanitizehtml')
const authMiddleware = require('../middlewares/authmiddleware')

//게시글 불러오기
router.get('/', articleCtl.boardRender)
router.get('/detail/:articleId', authMiddleware, articleCtl.boardList)
router.delete('/detail/:articleId', authMiddleware, articleCtl.boardDelete)

// 게시글 작성/수정/삭제
router.get('/write', authMiddleware, articleCtl.writeRender)
router.post('/write', sanitizer.sanitizer, articleValidation.articlePost, authMiddleware, articleCtl.writePost)
router.get('/write/:articleId', authMiddleware, articleCtl.updateRender)
router.put('/write/:articleId', articleValidation.articlePost, authMiddleware, articleCtl.writeUpdate)

// 추천하기
router.patch('/like', authMiddleware, articleCtl.likeDo)
router.patch('/unlike', authMiddleware, articleCtl.unlikeDo)

// 댓글 작성/수정/삭제
router.post('/comment', sanitizer.sanitizerComment, articleValidation.commentPost, authMiddleware, articleCtl.commentPost)
router.patch('/comment', sanitizer.sanitizerComment, articleValidation.commentUpdate, authMiddleware, articleCtl.commentUpdate)
router.delete('/comment', authMiddleware, articleCtl.commentDelete)

module.exports = router