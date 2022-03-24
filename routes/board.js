const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const moment = require("moment")

//
const Article = require("../models/article")
const articleValidation = require("../models/validations/articleValidation")

router.get("/", async (req, res)=>{ // 게시글 전체 불러오기
    const articles = await Article.find().sort({datetime : -1})

    res.status(200).render('board',{ articles })
})

router.get("/write", async (req, res) =>{ // 작성페이지
    res.render('write')
})

router.get("/write/:article_id", async (req, res)=>{
    const { article_id } = req.params
    const [ article ] = await Article.find({article_id : Number(article_id)})

    res.render('write',{ article })
})

router.post("/", articleValidation.articlePost, async (req, res) => { // 게시글 작성하기
    const { title, content, userName, password} = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")
    const hashedPw = bcrypt.hashSync(password, 10)

    const createArticle = await Article.create({
        title,
        content,
        userName,
        password : hashedPw,
        datetime,
    })

    res.status(201).json({ success : true, msg : '작성이 완료되었습니다'})
})

router.put("/:article_id", async (req, res) => {
    const { article_id } = req.params
    const { title, content, userName, password } = req.body
    const datetime = moment().format("YYYY-MM-DD HH:mm:ss")
    const [article] = await Article.find({article_id : Number(article_id)})

    if(bcrypt.compareSync(password, article.password)){
        await Article.updateOne({ article_id : Number(article_id)}, {$set : 
            {title, content, userName, datetime}
        })
        return res.status(201).json({msg : "수정이 완료되었습니다", success : true})
    } else{
        return res.json({msg : "비밀번호가 맞지 않습니다", success : false})
    }
})

router.delete("/:article_id", async (req, res) =>{
    const { article_id } = req.params
    const { password } = req.body
    const [article] = await Article.find({article_id : Number(article_id)})

    if(bcrypt.compareSync(password, article.password)){
        await Article.deleteOne({article_id : Number(article_id)})
        return res.status(200).json({msg : "삭제가 완료되었습니다", success : true})    
    } else{
        return res.json({msg : "비밀번호가 맞지 않습니다", success : false})
    }
})

router.get("/:article_id", async (req, res) => { // 게시글 상세페이지
    const { article_id } = req.params
    const [ article ] = await Article.find({ article_id : Number(article_id) })

    res.status(200).render('detail',{
        success : true,
        article
    })
})  

module.exports = router;