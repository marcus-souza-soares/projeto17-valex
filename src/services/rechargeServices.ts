import * as rechargeRepository from "../repositories/rechargeRepository.js";

export async function getRechargesByCardId(id: number){
    return await rechargeRepository.findByCardId(id);
}