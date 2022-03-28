const express = require("express")
const router = express.Router()
const moment = require("moment")


const Article = require("../models/article")
const Comment = require("../models/comment")
const articleValidation = require("../models/validations/articleValidation")
const sanitizer = require("../models/validations/sanitizehtml")
const passport = require("../passport")

router.get("/", async (req, res)=>{ // 게시글 전체 불러오기
    const articles = await Article.find().sort({datetime : -1})

    res.status(200).render('board',{ articles })
})

router.get("/auth", passport.authenticate('jwt',{session:false}), async (req, res) => {
    const {user} = req
     const nickName = user.nickName
     const userId = user.userId
     const userNo = user.userNo
     
     res.json({nickName, userId, userNo})
})

router.get("/write/:txt", async (req, res) => {
    const nickName = req.params.txt.split('&')[0]
    const userNo = req.params.txt.split('&')[1]
    const articleId = req.params.txt.split('&')[2]
    
    if(!articleId) return res.render('write', {nickName, userNo})
    const article = await Article.findOne({articleId:Number(articleId), nickName, userNo})
    
    if(article) return res.render('write', {article, nickName, userNo})
    res.send("<script>alert('글의 작성자만 수정할 수 있습니다'); window.location.href='/board';</script>");
})

router.post("/", sanitizer.sanitizer, articleValidation.articlePost, async (req, res) => { // 게시글 작성하기
    const { title, content, nickName, userNo} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    const createArticle = await Article.create({
        title,
        content,
        nickName,
        userNo : Number(userNo),
        datetime,
    })

    res.status(201).json({ success : true, msg : '작성이 완료되었습니다'})
})

router.put("/:articleId", passport.authenticate('jwt',{session:false}),
    articleValidation.articlePost, async(req, res) => {
    const {user} = req
    const {articleId} = req.params
    const {title, content, nickName, userNo} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    if(user.nickName !== nickName && user.userNo !== userNo){
        return res.status(400).json({"msg" : "글의 작성자 정보와 다릅니다"})
    }
    await Article.updateOne({articleId:Number(articleId)}, {$set:{title,content,datetime}})
    return res.status(201).json({"msg" : "수정이 완료되었습니다"})
})

router.post("/comment", articleValidation.commentPost, passport.authenticate('jwt',{session:false}), async (req, res) => {
    const {user} = req
    const {articleId, content} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    const comment = new Comment({articleId:Number(articleId), content, userNo : Number(user.userNo), nickName : user.nickName, datetime})
    await comment.save()

    res.status(201).json({"msg" : "댓글등록이 완료되었습니다"})
})

router.get("/comment", async(req, res) => {
    const {articleId} = req.query

    const comment = await Comment.find({articleId : Number(articleId)}).sort({commentId:+1})
    res.json({comment})
})

router.patch("/comment", articleValidation.commentUpdate, passport.authenticate('jwt', {session:false}), async(req, res) =>{
    const {commentId, content} = req.body
    const {user} = req
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")
    
    const comment = await Comment.findOne({commentId : Number(commentId), userNo:Number(user.userNo), nickName : user.nickName})
    if(!comment) return res.status(400).json({"msg" : "댓글 작성자가 본인인지 확인해주세요"})

    await Comment.updateOne({commentId : Number(commentId)}, {$set:{content, datetime}})
    res.json({"msg" : "댓글수정이 완료되었습니다"})
})

router.delete("/comment", passport.authenticate('jwt', {session:false}), async(req, res) => {
    const {user} = req
    const {commentId} = req.body
    try{
        await Comment.deleteOne({commentId : Number(commentId), userNo : Number(user.userNo)})
        return res.json({"msg" : "삭제가 완료되었습니다"})
    }catch(e){
        console.log(e)
        return res.status(400).json({"msg" : "댓글 작성자가 본인인지 확인해주세요"})
    }
})

router.get("/:articleId", async (req, res) => { // 게시글 상세페이지
    const { articleId } = req.params
    const [ article ] = await Article.find({ articleId : Number(articleId) })

    res.status(200).render('detail',{
        success : true,
        article
    })
})

router.delete("/:articleId", passport.authenticate('jwt',{session:false}), async (req,res) => {
    const {articleId} = req.params
    const {user} = req
    try{
        await Article.deleteOne({articleId : Number(articleId), userNo : user.userNo}).exec()
        return res.status(201).json({msg : "삭제가 완료되었습니다"})
    }catch(e){
        console.log(e)
        return res.status(400).json({"msg" : "글의 작성자가 본인이 맞는지 확인해주세요"})
    }
    
})
module.exports = router;