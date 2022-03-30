const express = require("express")
const routes = require("./routes")
const connect = require("./models")
const cors = require("cors")
const cookieParser = require("cookie-parser")
const { swaggerUi, specs } = require("./swagger")
const app = express()

// env 불러오기
require('dotenv').config();

// ejs setting
app.set('views',__dirname+'/views')
app.set('view engine','ejs')
app.engine('html', require('ejs').renderFile)

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
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs))
app.use('/', routes)

module.exports = app