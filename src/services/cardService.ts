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

export async function activateCard(id: number, CVC: string, password: string) {
    const card = await cardRepository.findById(id);
    if (!id) throw { code: "NotFound", message: "Este cartão não existe!" };
    const expirationDateVerify = verifyCardExpiration(card.expirationDate);
    if (expirationDateVerify)
        throw { code: "NotAllowed", message: "Cartão expirado" };
    if (card.password)
        throw { code: "Exists", message: "Este cartão já está ativado!" };
    if(!verifyCVC(CVC, card.securityCode)) throw {code: "NotAllowed", message: "Verifique o CVC!"}
    /* JÁ POSSUI UM REGEX QUE VERIFICA SE A SENHA TEM 4 DIGITOS NO SCHEMA */
    await cardRepository.update(id, { password: cryptPassword(password) });
}
function cryptPassword(password: string) {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    return cryptr.encrypt(password);
}

function verifyCardExpiration(expirationDate: string) {
    const expirationDateFormated = dayjs(`01/${expirationDate}`);
    const today = dayjs();
    const diff = dayjs(today).isAfter(dayjs(expirationDateFormated));
    return diff;
}
function verifyCVC(CVC: string, criptedCVC: string) {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    const decriptedCVC = cryptr.decrypt(criptedCVC);
    if (decriptedCVC === CVC) return true;
    return false;
}

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
        securityCode: generateCVC(),
        expirationDate: dayjs().add(5, "year").format("MM/YY"),
        type,
        isVirtual: false,
        isBlocked: false,
    };
    return card;
}
function generateCVC() {
    const CVC = faker.finance.creditCardCVV();
    console.log(CVC);
    const hash = new Cryptr(process.env.SECRET_KEY);
    return hash.encrypt(CVC);
}
