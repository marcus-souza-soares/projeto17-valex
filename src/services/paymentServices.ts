import * as paymentRepository from "../repositories/paymentRepository.js";

export async function getPaymentsByCardId(id: number){
    return await paymentRepository.findByCardId(id);
}