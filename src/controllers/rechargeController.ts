import { Response, Request } from "express";
import * as rechargeService from "../services/rechargeServices.js";

export async function rechargeCard(req: Request, res: Response){
    const { id } = req.params;
    const { amount } = req.body;
    const ApiKey = req.headers["x-api-key"].toString();
    if (!ApiKey) return res.sendStatus(401);
    await rechargeService.recharge(ApiKey, Number(id), Number(amount));
    res.status(200).send("OK")
}