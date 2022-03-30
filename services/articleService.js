const userService = require('../services/userService')

//Model
const articleModel = require('../models/article')
const userModel = require('../models/user')

module.exports = {
    getArticlesLists : (sdx, num) => { //article리스트 sdx기준 정렬해서 가져오기
        const lists = articleModel.find({}).sort([[sdx, Number(num)]])
        return lists
    },
    authChkRender : ( authResult ) => { // authResult 체크
        if(authResult !== '00'){
            return  "<script>alert('로그인을 하셔야 이용하실 수 있습니다');location.href='/user';</script>"
        } else  return true
    },
    articleChk : async ( articleId, userNo ) => { //article이 유저의 글인지 체크
        const article = await articleModel.findOne({
            articleId : Number(articleId),
            userNo : Number(userNo),
        })
        return article
    },
    createArticle : async ( title, content, nickName, userNo ) => { // article 작성
        const datetime = userService.nowDate()
        const createArticle = new articleModel({
            title,
            content,
            nickName,
            userNo : Number(userNo),
            datetime
        })
        await createArticle.save()
        return
    },
    updateArticle : async ( articleId, title, content, userNo ) => { // article 수정
        const datetime = userService.nowDate()
        await articleModel.updateOne({
            articleId : Number(articleId),
            userNo : Number(userNo),
        },
        {
            $set : {
                title, content, datetime
            }
        })
        return
    },
    deleteArticle : async ( articleId) => { // article 삭제
        await articleModel.deleteOne({articleId : Number(articleId)})
        return
    },
    articleData : async (articleId) => { //articleId로만 글 찾기
        const article = articleModel.findOne({articleId : Number(articleId)})
        return article
    },
    likeUpdate : async (articleId, userNo, func) => {
        if(func == 'like'){
            await articleModel.updateOne(
                {articleId : Number(articleId)},
                {$inc : { likes : 1 }, $push : { liked : Number(userNo)}}
            )
            await userModel.updateOne(
                {userNo : Number(userNo)},
                {$push : { liked : Number(articleId)}
            })
        } else if(func == 'unlike'){
            await articleModel.updateOne(
                {articleId : Number(articleId)},
                {$inc : { likes : -1 }, $pull : { liked : Number(userNo)}}
            )
            await userModel.updateOne(
                {userNo : Number(userNo)},
                {$pull : { liked : Number(articleId)}
            })
        }
        return
    },
    createComment : async (articleId, nickName, userNo, content) => {
        const datetime = userService.nowDate()
        const createComment = await articleModel.updateOne(
            { articleId : Number(articleId) },
            {
                $push : {
                    comments : {
                        nickName,
                        userNo : Number(userNo),
                        content,
                        datetime  
                    }
                }
            }
        )
        return
    },
    updateComment : async (articleId, userNo, commentId, content) => {
        if(content){
            articleModel.findOne({
                articleId : Number(articleId), userNo : Number(userNo)
            }, function (err, result) {
                result.comments.id(commentId).content = content
                result.save()
            })
        } else {
            articleModel.findOne({
                articleId : Number(articleId), userNo : Number(userNo)
            }, function (err, result) {
                result.comments.id(commentId).remove()
                result.save()
            })
        }
        return
    }
}