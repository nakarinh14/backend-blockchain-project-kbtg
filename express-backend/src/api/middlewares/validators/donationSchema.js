import Joi from 'joi'

export const donationSchema = Joi.object({
    token_access: Joi
        .string()
        .required(),
    amount: Joi
        .number()
        .required(),
    recipients: Joi
        .string()
        .required()
})
