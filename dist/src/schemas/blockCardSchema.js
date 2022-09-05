import joi from "joi";
export var blockCardSchema = joi.object({
    password: joi.string().regex(/^[0-9]{4}$/).required()
});
