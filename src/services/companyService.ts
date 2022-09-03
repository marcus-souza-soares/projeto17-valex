import * as companyRepository from "../repositories/companyRepository.js"

export async function findCompanyByApiKey(ApiKey: string){
    const result = await companyRepository.findByApiKey(ApiKey);
    if(!result) throw {code: "NotFound", message: "APIkey não econtrada no banco!"}
    return result;
}