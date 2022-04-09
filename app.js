const express = require('express')
const routes = require('./routes')
const connect = require('./models')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger-output')
const app = express()

// env 불러오기
require('dotenv').config()

// ejs setting
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.engine('html', require('ejs').renderFile)

//MongoDB Connection
connect()

//MiddleWare
app.use(express.static('views'))
app.use(express.static('.well-known'))
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded())
app.use((req, res, next) => {
	//x-Powerd-By 제거
	res.removeHeader('X-Powered-By')
	next()
})
app.use(cors())
app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerFile))

app.use('/', routes)

module.exports = app
