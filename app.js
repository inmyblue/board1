const express = require("express")
const connect = require("./models")
const cors = require("cors")
const crypto = require("crypto")
const helmet = require("helmet");
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
app.use((req, res, next) => {
    res.locals.cspNonce = crypto.randomBytes(16).toString("hex");
    next();
  });
app.use(helmet({
    contentSecurityPolicy: {
        directives : {
            defaultSrc : ["'self'"],
            scriptSrc : ["'self'", "*.bootstrapcdn.com", "*.googleapis.com", "*.jsdelivr.net",],
            scriptSrcAttr : ["'self'", "'unsafe-inline'"],
        }
    }
}))

// app.use(helmet()) 
app.use(cors())
app.use("/board", [boardRouter])

app.get('/', (req, res) => {
    res.redirect('/board')
})
 
app.listen(port, () => {console.log("Node On")})