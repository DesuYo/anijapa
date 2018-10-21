"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_handler_1 = require("../services/auth.handler");
exports.default = express_1.Router()
    .post('/', auth_handler_1.default('admin'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { db, body } = req;
        res
            .status(201)
            .json(yield db['anime'].create(body));
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=anime.routes.js.map