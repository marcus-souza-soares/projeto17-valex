import joi from "joi";

export const activateSchema = joi.object({
    cvc: joi.string().regex(/^[0-9]{3}$/).required(),
    password: joi.string().regex(/^[0-9]{4}$/).required()
})