import Joi from 'joi'

export const transactionSchema = Joi.object({
    amount: Joi
        .number()
        .required(),
    currencyType: Joi
        .string()
        .required(),
})
