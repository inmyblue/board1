const express = require('express')
const router = express.Router()

const article = require('./article')
const user = require('./user')

router.use('/board', article)
router.use('/user', user)

router.get('/', (req, res) => {
	// #swagger.tags = ['article']
	res.redirect('/board')
})

module.exports = router
