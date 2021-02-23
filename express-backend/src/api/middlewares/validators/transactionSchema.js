import Joi from 'joi'

export const transactionSchema = Joi.object({
    token_access: Joi
        .string()
        .required(),
    amount: Joi
        .number()
        .required(),
    currencyType: Joi
        .string()
        .required(),
})
