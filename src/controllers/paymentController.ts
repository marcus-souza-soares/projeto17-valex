import { Response, Request } from "express";
import { insert } from "../services/paymentService.js";

export async function payment(req: Request, res: Response) {
    const { id } = req.params;
    if (!id || Number(id) % 1 !== 0)
        return res.status(401).send("Insira o id corretamente!");
    const { amount, businessId, password } = req.body;
    await insert(businessId, Number(id), amount, password);
    res.status(200).send("OK");
}
//248
