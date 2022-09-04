
import joi from "joi";

export const blockCardSchema = joi.object({
    password: joi.string().regex(/^[0-9]{4}$/).required()
})