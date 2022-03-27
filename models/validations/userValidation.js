const Joi = require("joi")

const userValidation = {
    userPost : async (req,res,next) => {
        const body = req.body
        
        const schema = Joi.object().keys({
            userId : Joi.string().email().min(3).required(),
            nickName : Joi.string().min(3).max(30).alphanum().required(),
            password : Joi.string().min(4).required(),
            confirmPassword : Joi.ref('password'),
        })
        try{
            await schema.validateAsync(body)
        }catch(e){
            return res.status(400).send({"msg" : "아이디와 비밀번호 형식이 맞지 않습니다"})
        }
        next()
    },

    userLogin : async (req, res, next) => {
        const body = req.body
        const schema = Joi.object().keys({
            userId : Joi.string().min(3).email().required(),
            password : Joi.string().min(4).required(),
        })
        try{
            await schema.validateAsync(body)
        }catch(e){
            console.log(e)
            return res.status(400).send({"msg" : "e.message"})
        }
        next()
    }
}

module.exports = userValidation