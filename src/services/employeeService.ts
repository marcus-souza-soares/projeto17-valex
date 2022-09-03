import * as employeeRepository from "../repositories/employeeRepository.js"

export async function findEmployeeId(id: number){
    const result = employeeRepository.findById(id);
    if(!result) throw {code: "NotFound", message: "Funcionário não cadastrado!"}
    return result;
}