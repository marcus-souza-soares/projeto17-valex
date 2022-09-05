import * as rechargeRepository from "../repositories/rechargeRepository.js";
import * as companyService from "../services/companyService.js";
import * as cardService from "../services/cardService.js";

export async function getRechargesByCardId(id: number) {
    return await rechargeRepository.findByCardId(id);
}

export async function recharge(ApiKey: string, cardId: number, amount: number) {
    const company = await companyService.findCompanyByApiKey(ApiKey);
    if (!company)
        throw { code: "NotFound", message: "Empresa não encontrada!" };
    /*VALOR MAIOR QUE 0 VERIFICADO NO SCHEMA*/
    const card = await cardService.findCardById(cardId);
    if(!card) throw { code: "NotFound", message: "Cartão não encontrado!"}
    if(!card.password) throw { code: "NotAllowed", message: "Este cartão ainda não foi ativado!"}
    if(cardService.verifyCardExpiration(card.expirationDate)) throw {code: "NotAllowed", message: "Cartão expirado!"}
    await rechargeRepository.insert({cardId, amount})
}
