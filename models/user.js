const mongoose = require('mongoose')
const autoIdSetter = require('./auto-id')

const user = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
		unique: true,
	},
	nickName: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	datetime: {
		type: String,
		required: true,
	},
	liked: {
		type: [Number],
	},
})

autoIdSetter(user, mongoose, 'userNo', 'userNo')
module.exports = mongoose.model('User', user)
