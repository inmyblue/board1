const mongoose = require("mongoose")
const autoIdSetter = require("./auto-id")

const article = new mongoose.Schema({
    title : {
        type : String,
        required : true,
    },
    content : {
        type : String,
        required : true,
    },
    userName :{
        type : String,
        required : true,
    },
    password : {
        type : String,
        required : true,
    },
    datetime : {
        type : String,
        required : true,
    }
})

autoIdSetter(article, mongoose, 'aricle', 'article_id')
module.exports = mongoose.model("Article", article)