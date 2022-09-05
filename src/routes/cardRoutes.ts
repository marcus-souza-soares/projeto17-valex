import { Router } from "express";
import { createCard, activateCard, statement, blockCard, unblockCard } from "../controllers/cardController.js";
import { schemaValidate } from "../middlewares/schemaValidation.js";
import { createCardSchema } from "../schemas/createCardSchema.js";
import { activateSchema } from "../schemas/activateCardSchema.js";
import { blockCardSchema } from "../schemas/blockCardSchema.js";

const cardRouters = Router();

cardRouters.post("/createcard", schemaValidate(createCardSchema), createCard);
cardRouters.post("/activatecard/:id", schemaValidate(activateSchema), ()=> console.log("foii"))
cardRouters.get("/cardstatement/:id", statement);
cardRouters.patch("/card/:id/block", schemaValidate(blockCardSchema), blockCard);
cardRouters.patch("/card/:id/unblock", schemaValidate(blockCardSchema), unblockCard)
export default cardRouters;
