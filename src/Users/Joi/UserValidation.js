const joi = require("joi")

module.exports = {
    AddUserSchema: {
        body: joi.object().required().keys({
            FirstName: joi.string().required(),
            LastName: joi.string().required(),
            Age: joi.number().required(),
            Address: joi.string().required(),
            Phone: joi.number().required(),
            Gender: joi.number().valid('male', 'female').required(),
            Email: joi.string().email().required(),
            Password: joi.string().required(),
            RePassword: joi.ref("Password")
        })
    },
    SignUserSchema: {
        body: joi.object().required().keys({
            Email: joi.string().email().required(),
            Password: joi.string().required()
        })
    }
}