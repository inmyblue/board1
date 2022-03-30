const Joi = require('joi')

const articleValidation = {
	articlePost: async (req, res, next) => {
		const body = req.body
		const schema = Joi.object().keys({
			title: Joi.string()
				.trim()
				.min(5)
				.max(30)
				.required()
				.error(
					new Error('제목은 5자이상 30자 이내로 입력해야 합니다.')
				),
			content: Joi.string()
				.min(5)
				.required()
				.error(new Error('글의 내용은 5자이상 입력해야 합니다.')),
			nickName: Joi.string().min(4).max(30).required(),
			userNo: Joi.number().required(),
		})
		try {
			await schema.validateAsync(body)
		} catch (e) {
			return res.status(400).send({ msg: e.message })
		}
		next()
	},
	commentPost: async (req, res, next) => {
		const body = req.body
		const schema = Joi.object().keys({
			articleId: Joi.number()
				.required()
				.error(new Error('글의 ID가 없어요 돌아가세요')),
			content: Joi.string()
				.min(1)
				.required()
				.error(new Error('댓글의 내용이 입력되지 않았습니다')),
		})
		try {
			await schema.validateAsync(body)
		} catch (e) {
			return res.status(400).send({ msg: e.message })
		}
		next()
	},
	commentUpdate: async (req, res, next) => {
		const body = req.body
		const schema = Joi.object().keys({
			articleId: Joi.number()
				.required()
				.error(new Error('글의 ID가 없어요 돌아가세요')),
			content: Joi.string()
				.min(1)
				.required()
				.error(new Error('댓글의 내용이 입력되지 않았습니다')),
			commentId: Joi.string()
				.required()
				.error(new Error('댓글 ID가 없어요 돌아가세요')),
		})
		try {
			await schema.validateAsync(body)
		} catch (e) {
			return res.status(400).send({ msg: e.message })
		}
		next()
	},
}

module.exports = articleValidation
