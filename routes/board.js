const express = require("express")
const router = express.Router()
const moment = require("moment")


const Article = require("../models/article")
const Comment = require("../models/comment")
const articleValidation = require("../models/validations/articleValidation")
const sanitizer = require("../models/validations/sanitizehtml")
const passport = require("../passport")
const authMiddleware = require("../middlewares/authmiddleware")

/*
    게시글 목록을 불러와서 board.ejs 에 게시글정보를 넘겨주면서 렌더링
*/
router.get("/", authMiddleware, async (req, res)=>{
    const articles = await Article.find().sort({datetime : -1})
    res.status(200).render('board',{ articles })
})

router.get("/write", authMiddleware, async (req, res) => {
    const {user, authResult} = res.locals
    if(authResult !== "00") return res.send("<script>alert('로그인한 사용자만 들어올수 있어요'); location.href='/user';</script>")
    
    res.render('write', {userNo : user.userNo})
})

router.get("/write/:articleId", authMiddleware, async (req, res) => {
    const {user, authResult} = res.locals
    const {articleId} = req.params
    if(authResult !== "00") return res.send("<script>alert('로그인한 사용자만 들어올수 있어요'); location.href='/user';</script>")

    const article = await Article.findOne({articleId : Number(articleId), userNo : Number(user.userNo)})
    if(article) res.render('write', {article, userNo : user.userNo, nickName : user.nickName})
    else return res.send("<script>alert('수정은 작성자만 가능합니다'); location.href='/board';</script>")
})

router.post("/write", sanitizer.sanitizer, articleValidation.articlePost, async (req, res) => { // 게시글 작성하기
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

router.put("/write/:articleId", authMiddleware, articleValidation.articlePost, async(req, res) => {
    const {user, authResult} = res.locals
    if(authResult !== "00") return res.status(401).json({'msg' : "로그인정보가 올바르지 않습니다"})
    const {articleId} = req.params
    const {title, content, userNo} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    await Article.updateOne({articleId:Number(articleId), userNo:Number(userNo)}, {$set:{title,content,datetime}})
    return res.status(201).json({"msg" : "수정이 완료되었습니다"})
})

router.post("/comment", articleValidation.commentPost, authMiddleware, async (req, res) => {
    const {user, authResult} = res.locals
    const {articleId, content} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    if(authResult !== "00") return res.status(401).send()

    const comment = new Comment({articleId:Number(articleId), content, userNo : Number(user.userNo), nickName : user.nickName, datetime})
    await comment.save()

    res.status(201).json({"msg" : "댓글등록이 완료되었습니다"})
})

router.get("/comment", authMiddleware, async(req, res) => {
    const {articleId} = req.query
    const {authResult} = res.locals
    let user = {userNo:"", nickName:""}
    if(authResult === "00") user = res.locals.user

    const comment = await Comment.find({articleId : Number(articleId)}).sort({commentId:+1})
    res.json({comment, userNo : user.userNo, nickName : user.nickName})
})

router.patch("/comment", articleValidation.commentUpdate, authMiddleware, async(req, res) =>{
    const {commentId, content} = req.body
    const {user, authResult} = res.locals
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")

    if(authResult !== "00") return res.status(401).json({"msg" : "로그인정보가 올바르지 않습니다"})
    
    const comment = await Comment.findOne({commentId : Number(commentId), userNo:Number(user.userNo)})
    if(!comment) return res.status(401).json({"msg" : "댓글 작성자가 본인인지 확인해주세요"})

    await Comment.updateOne({commentId : Number(commentId)}, {$set:{content, datetime}})
    res.json({"msg" : "댓글수정이 완료되었습니다"})
})

router.delete("/comment", authMiddleware, async(req, res) => {
    const {user} = res.locals
    const {commentId} = req.body
    try{
        await Comment.deleteOne({commentId : Number(commentId), userNo : Number(user.userNo)})
        return res.json({"msg" : "삭제가 완료되었습니다"})
    }catch(e){
        console.log(e)
        return res.status(400).json({"msg" : "댓글 작성자가 본인인지 확인해주세요"})
    }
})

router.get("/:articleId", authMiddleware, async (req, res) => { // 게시글 상세페이지
    const authResult = res.locals.authResult
    const { articleId } = req.params
    const [ article ] = await Article.find({ articleId : Number(articleId) })
    let user = {userNo:"", nickName:""}

    if(authResult === "11") res.send("<script>alert('로그인 정보가 잘못되었어요'); location.href='/board';</script>")
    if(authResult === "00") user = res.locals.user
    res.render('detail',{
        article, userNo : user.userNo, nickName : user.nickName
    })
})

router.delete("/:articleId", authMiddleware, async (req,res) => {
    const {articleId} = req.params
    try{
        await Article.deleteOne({articleId : Number(articleId), userNo : user.userNo}).exec()
        return res.status(201).json({msg : "삭제가 완료되었습니다"})
    }catch(e){
        console.log(e)
        return res.status(400).json({"msg" : "글의 작성자가 본인이 맞는지 확인해주세요"})
    }
    
})

module.exports = router;