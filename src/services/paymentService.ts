import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardService from "../services/cardService.js";
import * as businessService from "../services/businessService.js";

export async function getPaymentsByCardId(id: number) {
    return await paymentRepository.findByCardId(id);
}

export async function insert(
    businessId: number,
    cardId: number,
    amount: number,
    password: string
) {
    const card = await cardService.findCardById(cardId);
    if (!card) throw { code: "NotFound", message: "Este cartão não existe!" };
    if (cardService.verifyCardExpiration(card.expirationDate))
        throw { code: "NotAllowed", message: "Cartão vencido!" };
    if (!card.password || !!card.isBlocked)
        throw {
            code: "NotAllowed",
            message: "Verifique se o cartão está bloqueado ou desativado!",
        };
    if (!cardService.verifyPassword(password, card.password))
        throw { code: "NotAlowed", message: "Senha incorreta!" };
    const business = await businessService.findById(businessId);
    if (!business)
        throw {
            code: "NotFound",
            message: "Essa empresa não foi encontrada no sistema.",
        };
    if (business.type !== card.type)
        throw {
            code: "NotAllowed",
            message: "O tipo de cartão não consta com o tipo da empresa!",
        };
    const { balance } = await cardService.getStatement(cardId);
    if (balance - amount < 0)
        throw {
            code: "NotAllowed",
            message: "Saldo insuficiente para a transação!",
        };
    await paymentRepository.insert({ businessId, amount, cardId });
}
