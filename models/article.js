const mongoose = require("mongoose")
const autoIdSetter = require("./auto-id")

const article = new mongoose.Schema({
    nickName :{
        type : String,
        required : true,
    },
    userNo : {
        type : Number,
        required : true,
    },
    title : {
        type : String,
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

autoIdSetter(article, mongoose, 'aricle', 'articleId')
module.exports = mongoose.model("Article", article)