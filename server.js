const app = require('./app')
const fs = require('fs')
const https = require('https')
const domain = process.env.DOMAIN

const privateKey = fs.readFileSync(
	`/etc/letsencrypt/live/${domain}/privkey.pem`,
	'utf8'
)
const certificate = fs.readFileSync(
	`/etc/letsencrypt/live/${domain}/cert.pem`,
	'utf8'
)
const ca = fs.readFileSync(`/etc/letsencrypt/live/${domain}/chain.pem`, 'utf8')

const credentials = {
	key: privateKey,
	cert: certificate,
	ca: ca,
}

const httpsServer = https.createServer(credentials, app)

// const PORT = 3000

httpsServer.listen(443, () => {
	console.log('HTTPS Server running on port 443')
})
// app.listen(PORT, handleListening())
