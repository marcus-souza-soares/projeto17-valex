var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import dayjs from "dayjs";
import { faker } from "@faker-js/faker";
import Cryptr from "cryptr";
import dotenv from "dotenv";
import * as companyService from "../services/companyService.js";
import * as cardRepository from "../repositories/cardRepository.js";
import { findCompanyByApiKey } from "./companyService.js";
import { findEmployeeId } from "./employeeService.js";
import * as cardUtils from "../utils/cardUtils.js";
import * as paymentService from "./paymentService.js";
import * as rechageService from "./rechargeService.js";
dotenv.config();
export function blockCard(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
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
                    return [4 /*yield*/, cardRepository.update(id, { isBlocked: true })];
                case 2:
                    /* A SENHA JÁ FOI VERIFICADA NO SCHEMA */
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function unblockCard(id, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
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
                            message: "Este cartão já está desbloqueado!"
                        };
                    /* A SENHA JÁ FOI VERIFICADA NO SCHEMA */
                    return [4 /*yield*/, cardRepository.update(id, { isBlocked: false })];
                case 2:
                    /* A SENHA JÁ FOI VERIFICADA NO SCHEMA */
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function getStatement(id) {
    return __awaiter(this, void 0, void 0, function () {
        var recharges, payments, card, totalRecharges, totalPayments, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, rechageService.getRechargesByCardId(id)];
                case 1:
                    recharges = _a.sent();
                    return [4 /*yield*/, paymentService.getPaymentsByCardId(id)];
                case 2:
                    payments = _a.sent();
                    return [4 /*yield*/, cardRepository.findById(id)];
                case 3:
                    card = _a.sent();
                    if (!card)
                        throw { code: "NotFound", message: "Esse cartão não existe" };
                    totalRecharges = recharges.reduce(function (total, recharge) { return total + recharge.amount; }, 0);
                    totalPayments = payments.reduce(function (total, payment) { return total + payment.amount; }, 0);
                    balance = totalRecharges - totalPayments;
                    return [2 /*return*/, { balance: balance, transactions: payments, recharges: recharges }];
            }
        });
    });
}
export function activateCard(id, CVC, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, expirationDateVerify;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1:
                    card = _a.sent();
                    if (!id)
                        throw { code: "NotFound", message: "Este cartão não existe!" };
                    expirationDateVerify = verifyCardExpiration(card.expirationDate);
                    if (expirationDateVerify)
                        throw { code: "NotAllowed", message: "Cartão expirado" };
                    if (card.password)
                        throw { code: "Exists", message: "Este cartão já está ativado!" };
                    if (!verifyCVC(CVC, card.securityCode))
                        throw { code: "NotAllowed", message: "Verifique o CVC!" };
                    /* JÁ POSSUI UM REGEX QUE VERIFICA SE A SENHA TEM 4 DIGITOS NO SCHEMA */
                    return [4 /*yield*/, cardRepository.update(id, { password: cryptPassword(password) })];
                case 2:
                    /* JÁ POSSUI UM REGEX QUE VERIFICA SE A SENHA TEM 4 DIGITOS NO SCHEMA */
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
export function verifyPassword(password, cryptedPassowd) {
    var crypt = new Cryptr(process.env.SECRET_KEY);
    if (password === crypt.decrypt(cryptedPassowd))
        return true;
    return false;
}
function cryptPassword(password) {
    var cryptr = new Cryptr(process.env.SECRET_KEY);
    return cryptr.encrypt(password);
}
export function verifyCardExpiration(expirationDate) {
    var expirationDateFormated = dayjs("01/".concat(expirationDate));
    var today = dayjs();
    var diff = dayjs(today).isAfter(dayjs(expirationDateFormated));
    return diff;
}
function verifyCVC(CVC, criptedCVC) {
    var cryptr = new Cryptr(process.env.SECRET_KEY);
    var decriptedCVC = cryptr.decrypt(criptedCVC);
    if (decriptedCVC === CVC)
        return true;
    return false;
}
export function createCard(ApiKey, employeeId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var result, employee, card;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, companyService.findCompanyByApiKey(ApiKey)];
                case 1:
                    result = _a.sent();
                    if (!result)
                        throw { code: "NotFound", message: "Empresa não cadastrada!" };
                    return [4 /*yield*/, findCompanyByApiKey(ApiKey)];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, findEmployeeId(employeeId)];
                case 3:
                    employee = _a.sent();
                    return [4 /*yield*/, cardRepository.findByTypeAndEmployeeId(type, employeeId)];
                case 4:
                    card = _a.sent();
                    if (card)
                        throw { code: "Exists", message: "Este cartão já está cadastrado!" };
                    return [4 /*yield*/, cardRepository.insert(buildCardData(employee, type))];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function buildCardData(employee, type) {
    var card = {
        employeeId: employee.id,
        number: faker.finance.creditCardNumber(),
        cardholderName: cardUtils.generateNameToCard(employee.fullName),
        securityCode: generateCVC(),
        expirationDate: dayjs().add(5, "year").format("MM/YY"),
        type: type,
        isVirtual: false,
        isBlocked: false
    };
    return card;
}
function generateCVC() {
    var CVC = faker.finance.creditCardCVV();
    console.log(CVC);
    var hash = new Cryptr(process.env.SECRET_KEY);
    return hash.encrypt(CVC);
}
export function findCardById(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardRepository.findById(id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
