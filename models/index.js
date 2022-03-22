const mongoose = require("mongoose")
const connect = () => {
    const mongooseId = process.env.MONGO_ID
    const mongoosePw = process.env.MONGO_PWD
    mongoose.connect(`mongodb://${mongooseId}:${mongoosePw}@localhost:27017/board`, {ignoreUndefined : true}).catch((err)=>{
        console.error(err)
    })
    console.log("mongoDB connected")
}

module.exports = connect