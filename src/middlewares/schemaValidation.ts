import { Response, Request, NextFunction } from "express";

export function schemaValidate(schema: any){

    const verification = (req: Request, res: Response, next: NextFunction) => {
        const dados = req.body;
        const {error} = schema.validate(dados, {abortEarly: false});
        if (error) {
          return res.status(422).send(error.details.map((detail:{message: object}) => detail.message));
        }
        next();
      }
      return verification;
}