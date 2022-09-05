import { Router } from "express";
import { schemaValidate } from "../middlewares/schemaValidation.js";
import { rechargeSchema } from "../schemas/rechargeSchema.js";
import { rechargeCard } from "../controllers/rechargeController.js"

const rechargeRoutes = Router();

rechargeRoutes.use("/recharge/card/:id", schemaValidate(rechargeSchema), rechargeCard);

export default rechargeRoutes;