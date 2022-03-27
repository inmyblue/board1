const mongoose = require("mongoose")
const autoIdSetter = require("./auto-id")

const comment = new mongoose.Schema({
    articleId : {
        type : Number,
        required : true,
    },
    nickName :{
        type : String,
        required : true,
    },
    userNo : {
        type : Number,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    datetime : {
        type : String,
        required : true,
    }
})

autoIdSetter(comment, mongoose, 'comment', 'commentId')
module.exports = mongoose.model("Comment", comment)