import Joi from 'joi'

export const donationSchema = Joi.object({
    token_access: Joi
        .string()
        .required(),
    amount: Joi
        .number()
        .required(),
    recipient: Joi
        .string()
        .required(),
    cause: Joi
        .string()
        .required()
})
