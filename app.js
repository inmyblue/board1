const express = require("express")
const connect = require("./models")
const cors = require("cors")
const passport = require("passport")

require('dotenv').config();
const app = express()
const port = 3000

// ejs setting
app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

//router
// const passportConfig = require('./auth/passport');
const boardRouter = require("./routes/board")
const userRouter = require("./routes/user")

connect()

//MiddleWare
app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded())
app.use(function (req, res, next) { //x-Powerd-By 제거
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

app.listen(port, () => {console.log("Node On")})