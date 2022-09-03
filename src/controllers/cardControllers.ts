import { Response, Request } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const ApiKey = req.headers["x-api-key"].toString();
    if (!ApiKey) return res.sendStatus(401);
    const { employeeId, type } = req.body;

    await cardService.createCard(ApiKey, employeeId, type);
    res.sendStatus(201);
}
