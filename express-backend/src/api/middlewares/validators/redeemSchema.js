import Joi from "joi";

export const redeemSchema = Joi.object({
    amount: Joi
        .number()
        .required(),
    cause: Joi
        .string()
        .required()
})
