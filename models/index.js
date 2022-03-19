const mongoose = require("mongoose")
const connect = () => {
    mongoose.connect("mongodb://localhost:27017/board", {ignoreUndefined : true}).catch((err)=>{
        console.error(err)
    })
    console.log("mongoDB connected")
}

module.exports = connect