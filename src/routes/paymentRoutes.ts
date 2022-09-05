import { Router } from "express";
import { schemaValidate } from "../middlewares/schemaValidation.js";
import { paymentSchema } from "../schemas/paymentSchema.js";

const paymentRouter = Router();

paymentRouter.post("/payment/card/:id", schemaValidate(paymentSchema),  () => console.log("Foiii"))

export default paymentRouter;