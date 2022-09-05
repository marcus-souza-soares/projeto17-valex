import { Router } from "express";
import { schemaValidate } from "../middlewares/schemaValidation.js";
import { paymentSchema } from "../schemas/paymentSchema.js";
import { payment } from "../controllers/paymentController.js";
var paymentRouter = Router();
paymentRouter.post("/payment/card/:id", schemaValidate(paymentSchema), payment);
export default paymentRouter;
