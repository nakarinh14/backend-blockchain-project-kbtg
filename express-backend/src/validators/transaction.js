import Joi from 'joi'

const schema = Joi.object({
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

export const transactionValidator = createValidatorMiddleware(schema);
