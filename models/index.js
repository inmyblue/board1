const mongoose = require("mongoose")
const connect = () => {
    const mongooseId = process.env.MONGO_ID
    const mongoosePw = process.env.MONGO_PWD
    mongoose.connect("mongodb://"+mongooseId+":"+mongoosePw+"@52.79.81.116:27017/board?authSource=admin&authMechanism=SCRAM-SHA-1", {ignoreUndefined : true}).catch((err)=>{
        if (err) throw err; console.log('데이터베이스에 연결되었습니다. : ' + databaseUrl);
    })
    console.log("mongoDB connected")
}

module.exports = connect