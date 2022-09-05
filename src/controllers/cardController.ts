import { Response, Request } from "express";
import * as cardService from "../services/cardService.js";

export async function createCard(req: Request, res: Response) {
    const ApiKey = req.headers["x-api-key"].toString();
    if (!ApiKey) return res.sendStatus(401);
    const { employeeId, type } = req.body;
    
    await cardService.createCard(ApiKey, employeeId, type);
    res.sendStatus(201);
}

export async function activateCard(req: Request, res: Response){
    const { id } = req.params;
    const { cvc, password } = req.body;
    if(!id || Number(id) % 1 !== 0) return res.status(401).send("Insira o id corretamente!");
    await cardService.activateCard(Number(id), cvc, password);
    res.sendStatus(200);
}
export async function statement(req: Request, res: Response){
    const { id } = req.params;
    if(!id || Number(id) % 1 !== 0) return res.status(401).send("Insira o id corretamente!");
    const statement = await cardService.getStatement(Number(id));
    res.status(200).send(statement);
}

export async function blockCard(req: Request, res: Response){
    const { id } = req.params;
    const { password } = req.body;
    if(!id || Number(id) % 1 !== 0) return res.status(401).send("Insira o id corretamente!");
    await cardService.blockCard(Number(id), password);
    res.sendStatus(200);
}
export async function unblockCard(req: Request, res: Response){
    const { id } = req.params;
    const { password } = req.body;
    if(!id || Number(id) % 1 !== 0) return res.status(401).send("Insira o id corretamente!");
    await cardService.unblockCard(Number(id), password);
    res.sendStatus(200);
}