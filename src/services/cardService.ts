import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as employeeRepository from "../repositories/employeeRepository.js";
import * as companyService from "../services/companyService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { findCompanyByApiKey } from "./companyService.js";
import { findEmployeeId } from "./employeeService.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as paymentService from "./paymentService.js";
import * as rechageService from "./rechargeService.js";

dotenv.config();

export async function blockCard(id: number, password: string) {
    const card = await cardRepository.findById(id);
    if (!card)
        throw { code: "NotFound", message: "Este cartão não está cadastrado!" };
    console.log(card.expirationDate);
    if (verifyCardExpiration(card.expirationDate))
        throw { code: "NotAllowed", message: "Cartão está vencido!" };
    if (!verifyPassword(password, card.password))
        throw { code: "NotAllowed", message: "Senha incorreta!" };
    if (card.isBlocked)
        throw { code: "NotAllowed", message: "Este cartão já está bloqueado!" };
    /* A SENHA JÁ FOI VERIFICADA NO SCHEMA */
    await cardRepository.update(id, { isBlocked: true });
}
export async function unblockCard(id: number, password: string) {
    const card = await cardRepository.findById(id);
    if (!card)
        throw { code: "NotFound", message: "Este cartão não está cadastrado!" };
    console.log(card.expirationDate);
    if (verifyCardExpiration(card.expirationDate))
        throw { code: "NotAllowed", message: "Cartão está vencido!" };
    if (!verifyPassword(password, card.password))
        throw { code: "NotAllowed", message: "Senha incorreta!" };
    if (!card.isBlocked)
        throw {
            code: "NotAllowed",
            message: "Este cartão já está desbloqueado!",
        };
    /* A SENHA JÁ FOI VERIFICADA NO SCHEMA */
    await cardRepository.update(id, { isBlocked: false });
}

export async function getStatement(id: number) {
    const recharges = await rechageService.getRechargesByCardId(id);
    const payments = await paymentService.getPaymentsByCardId(id);
    const card = await cardRepository.findById(id);
    if (!card) throw { code: "NotFound", message: "Esse cartão não existe" };
    const totalRecharges = recharges.reduce(
        (total, recharge) => total + recharge.amount,
        0
    );
    const totalPayments = payments.reduce(
        (total, payment) => total + payment.amount,
        0
    );
    const balance = totalRecharges - totalPayments;
    return { balance, transactions: payments, recharges };
}

export async function activateCard(id: number, CVC: string, password: string) {
    const card = await cardRepository.findById(id);
    if (!card) throw { code: "NotFound", message: "Este cartão não existe!" };
    const expirationDateVerify = verifyCardExpiration(card.expirationDate);
    if (expirationDateVerify)
        throw { code: "NotAllowed", message: "Cartão expirado" };
    if (card.password)
        throw { code: "Exists", message: "Este cartão já está ativado!" };
    if (!verifyCVC(CVC, card.securityCode))
        throw { code: "NotAllowed", message: "Verifique o CVC!" };
    /* JÁ POSSUI UM REGEX QUE VERIFICA SE A SENHA TEM 4 DIGITOS NO SCHEMA */
    await cardRepository.update(id, { password: cryptPassword(password) });
}
export function verifyPassword(password: string, cryptedPassowd: string) {
    const crypt = new Cryptr(process.env.SECRET_KEY);
    if (password === crypt.decrypt(cryptedPassowd)) return true;
    return false;
}
function cryptPassword(password: string) {
    const cryptr = new Cryptr(process.env.SECRET_KEY);
    return cryptr.encrypt(password);
}

export function verifyCardExpiration(expirationDate: string) {
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
    const result: object = await companyService.findCompanyByApiKey(ApiKey);
    if (!result) throw { code: "NotFound", message: "Empresa não cadastrada!" };
    await findCompanyByApiKey(ApiKey);
    const employee = await findEmployeeId(employeeId);
    const card = await cardRepository.findByTypeAndEmployeeId(type, employeeId);
    if (card)
        throw { code: "Exists", message: "Este cartão já está cadastrado!" };
    await cardRepository.insert(buildCardData(employee, type));
}

function buildCardData(
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

export async function findCardById(id: number) {
    return await cardRepository.findById(id);
}
