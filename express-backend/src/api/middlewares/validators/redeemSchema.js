import Joi from "joi";

export const redeemSchema = Joi.object({
    org: Joi
        .string()
        .required(),
    amount: Joi
        .number()
        .required(),
    cause: Joi
        .string()
        .required()
})
