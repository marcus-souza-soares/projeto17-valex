import { Response, Request } from "express";
import * as rechargeService from "../services/rechargeService.js";

export async function rechargeCard(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || Number(id) % 1 !== 0)
        return res.status(401).send("Insira o id corretamente!");
    const { amount } = req.body;
    const ApiKey = req.headers["x-api-key"].toString();
    if (!ApiKey) return res.sendStatus(401);
    await rechargeService.recharge(ApiKey, Number(id), Number(amount));
    res.status(200).send("OK");
}
