import * as businessRepository from "../repositories/businessRepository.js";

export async function findById(id: number) {
    return businessRepository.findById(id);
}
