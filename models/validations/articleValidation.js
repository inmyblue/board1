const Joi = require("joi")

const articleValidation = {
    articlePost : async (req,res,next) => {
        const body = req.body
        const schema = Joi.object().keys({
            title : Joi.string().min(5).max(30).required(),
            content : Joi.string().min(5).required(),
            userName : Joi.string().min(1).max(15).required(),
            password : Joi.string().min(4).max(15).required(),
        })
        try{
            await schema.validateAsync(body)
        }catch(e){
            return res.status(400).send({"msg" : e.message})
        }
        next()
    }
}

module.exports = articleValidation