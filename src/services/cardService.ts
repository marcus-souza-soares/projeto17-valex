import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyRepository from "../repositories/companyRepository.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { findCompanyByApiKey } from "./companyService.js";
import { findEmployeeId } from "./employeeService.js";
import * as cardUtils from "../utils/cardUtils.js";
dotenv.config();

export async function createCard(
    ApiKey: string,
    employeeId: number,
    type: cardRepository.TransactionTypes
) {
    const result: object = await companyRepository.findByApiKey(ApiKey);
    if (!result) throw { code: "NotFound", message: "Empresa não cadastrada!" };
    await findCompanyByApiKey(ApiKey);
    const employee = await findEmployeeId(employeeId);
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (card)
        throw { code: "Exists", message: "Este cartão já está cadastrado!" };
    await cardRepository.insert(buildCard(employee, type));
}

function buildCard(
    employee: employeeRepository.Employee,
    type: cardRepository.TransactionTypes
) {
    const card = {
        employeeId: employee.id,
        number: faker.finance.creditCardNumber(),
        cardholderName: cardUtils.generateNameToCard(employee.fullName),
        securityCode: generateCVV(),
        expirationDate: dayjs().add(5, "year").format("MM-YY"),
        type,
        isVirtual: false,
        isBlocked: false,
    };
    return card;
}
function generateCVV() {
    const CVV = faker.finance.creditCardCVV();
    const hash = new Cryptr(process.env.SECRET_KEY);
    return hash.encrypt(CVV);
}

