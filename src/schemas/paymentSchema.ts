import joi from "joi";

export const paymentSchema = joi.object({
    password: joi.string().regex(/^[0-9]{4}$/).required(),
    amount: joi.number().min(1).required(),
    businessId: joi.number().integer().min(1).required()
});