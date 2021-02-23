import Joi from 'joi'

const schema = Joi.object({
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

export const donationValidator = createValidatorMiddleware(schema);
