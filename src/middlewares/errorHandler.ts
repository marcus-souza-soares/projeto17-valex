import { NextFunction, Request, Response } from "express";

export async function errorHandlingMiddleware(error, req: Request, res: Response, next: NextFunction) {
    if (error.code === "NotFound") return res.status(404).send(error.message);
    if (error.code === "Exists") return res.status(409).send(error.message);
    if (error.code === "NotAllowed") return res.status(406).send(error.message);
    return res.sendStatus(500);
}
