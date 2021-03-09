import Joi from 'joi'

export const registerSchema = Joi.object({
    token_access: Joi
        .string()
        .required(),
    firstname: Joi
        .string()
        .required(),
    middlename: Joi
        .string(),
    lastname: Joi
        .string()
        .required(),
})
