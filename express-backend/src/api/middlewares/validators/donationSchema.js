import Joi from 'joi'

export const donationSchema = Joi.object({
    amount: Joi
        .number()
        .required(),
    recipient: Joi
        .string()
        .required(),
    cause: Joi
        .string()
        .required(),
    tax_reduction: Joi
        .bool()
        .required()
})
