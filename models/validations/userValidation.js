const Joi = require('joi')

const userValidation = {
	userPost: async (req, res, next) => {
		const body = req.body

		const schema = Joi.object().keys({
			userId: Joi.string()
				.email()
				.min(3)
				.required()
				.error(
					new Error('ID는 이메일형식으로 3글자 이상 작성해야합니다.')
				),
			nickName: Joi.string()
				.min(3)
				.max(30)
				.alphanum()
				.required()
				.error(
					new Error('닉네임은 3글자 이상 영어와 숫자만 가능합니다')
				),
			password: Joi.string()
				.min(4)
				.required()
				.error(new Error('비밀번호는 4글자 이상 작성해야 합니다')),
			confirmPassword: Joi.ref('password'),
		})
		try {
			await schema.validateAsync(body)
		} catch (e) {
			return res.status(401).send({ msg: e.message })
		}
		next()
	},

	userLogin: async (req, res, next) => {
		const body = req.body
		const schema = Joi.object().keys({
			userId: Joi.string()
				.min(3)
				.email()
				.required()
				.error(new Error('ID는 이메일형식으로 작성하셔야 합니다')),
			password: Joi.string()
				.min(4)
				.required()
				.error(new Error('비밀번호는 4글자 이상 작성하셔야 합니다')),
		})
		try {
			await schema.validateAsync(body)
		} catch (e) {
			return res.status(401).send({ msg: e.message })
		}
		next()
	},
}

module.exports = userValidation
