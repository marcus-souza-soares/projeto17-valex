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
import * as paymentRepository from "../repositories/paymentRepository.js";
import * as cardService from "../services/cardService.js";
import * as businessService from "../services/businessService.js";
export function getPaymentsByCardId(id) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, paymentRepository.findByCardId(id)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
export function insert(businessId, cardId, amount, password) {
    return __awaiter(this, void 0, void 0, function () {
        var card, business, balance;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, cardService.findCardById(cardId)];
                case 1:
                    card = _a.sent();
                    if (!card)
                        throw { code: "NotFound", message: "Este cartão não existe!" };
                    if (cardService.verifyCardExpiration(card.expirationDate))
                        throw { code: "NotAllowed", message: "Cartão vencido!" };
                    if (!card.password || !!card.isBlocked)
                        throw {
                            code: "NotAllowed",
                            message: "Verifique se o cartão está bloqueado ou desativado!"
                        };
                    if (!cardService.verifyPassword(password, card.password))
                        throw { code: "NotAlowed", message: "Senha incorreta!" };
                    return [4 /*yield*/, businessService.findById(businessId)];
                case 2:
                    business = _a.sent();
                    if (!business)
                        throw {
                            code: "NotFound",
                            message: "Essa empresa não foi encontrada no sistema."
                        };
                    if (business.type !== card.type)
                        throw {
                            code: "NotAllowed",
                            message: "O tipo de cartão não consta com o tipo da empresa!"
                        };
                    return [4 /*yield*/, cardService.getStatement(cardId)];
                case 3:
                    balance = (_a.sent()).balance;
                    if (balance - amount < 0)
                        throw {
                            code: "NotAllowed",
                            message: "Saldo insuficiente para a transação!"
                        };
                    return [4 /*yield*/, paymentRepository.insert({ businessId: businessId, amount: amount, cardId: cardId })];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
