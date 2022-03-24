const express = require("express")
const connect = require("./models")
const cors = require("cors")
const xXssProtection = require("x-xss-protection");
const app = express()
const port = 3000
require('dotenv').config();

// ejs setting
app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

//router
const boardRouter = require("./routes/board")

connect()

//MiddleWare
app.use(express.static('views'))
app.use(express.json())
app.use(express.urlencoded())
app.use(xXssProtection()); // XSS 프로텍션
app.use(function (req, res, next) { //x-Powerd-By 제거
    res.removeHeader("X-Powered-By");
    next();
    });
app.use(cors())
app.use("/board", [boardRouter])

app.get('/', (req, res) => {
    res.redirect('/board')
})
 
app.listen(port, () => {console.log("Node On")})