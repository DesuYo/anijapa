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
const sql_service_1 = require("../services/sql.service");
const db = new sql_service_1.PostgresService(process.env.PG_URL);
exports.default = express_1.Router()
    .post('/signup', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield db.insert('users', req.body);
        return res.status(201).json(user);
    }
    catch (error) {
        return res.status(500).json(error);
    }
}));
//# sourceMappingURL=users.routes.js.map