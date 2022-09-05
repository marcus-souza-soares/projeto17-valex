import joi from "joi";
export var createCardSchema = joi.object({
    employeeId: joi.number().integer().positive().required(),
    type: joi.string().valid("groceries", "restaurants", "transport", "education", "health").required()
});
