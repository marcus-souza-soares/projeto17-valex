import joi from "joi";
export var rechargeSchema = joi.object({
    amount: joi.number().min(1).required()
});
