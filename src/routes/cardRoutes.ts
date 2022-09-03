import { Router } from "express";
import { createCard } from "../controllers/cardControllers.js";
import { schemaValidate } from "../middlewares/schemaValidation.js";
import { createCardSchema } from "../schemas/createCardSchema.js";

const cardRouters = Router();

cardRouters.post("/createcard", schemaValidate(createCardSchema), createCard);

export default cardRouters;
