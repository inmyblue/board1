const express = require("express")
const connect = require("./models")
const cors = require("cors")
const passport = require("passport")
const cookieParser = require("cookie-parser")
const app = express()

// env 불러오기
require('dotenv').config();

// ejs setting
app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

//router
const boardRouter = require("./routes/board")
const userRouter = require("./routes/user")


//MongoDB Connection
connect()

//MiddleWare
app.use(express.static('views'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())
app.use((req, res, next)=>{ //x-Powerd-By 제거
    res.removeHeader("X-Powered-By");
    next();
});
app.use(cors())
app.use(passport.initialize())

app.use("/board", [boardRouter])
app.use("/user", [userRouter])
app.get('/', (req, res) => {
    res.redirect('/board')
})

module.exports = app