import Joi from 'joi'

export const registerSchema = Joi.object({
    firstname: Joi
        .string()
        .required(),
    middlename: Joi
        .string(),
    lastname: Joi
        .string()
        .required(),
})
