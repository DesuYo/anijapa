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
const validations_handler_1 = require("../services/validations.handler");
const users_schema_1 = require("../validations/users.schema");
const users_model_1 = require("../models/users.model");
exports.default = express_1.Router()
    .post('/signup', validations_handler_1.default(users_schema_1.createUserSchema), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = new users_model_1.default(req.body);
        return res
            .status(201)
            .json(yield user.save());
    }
    catch (error) {
        next(error);
    }
}))
    .patch('/me', auth_handler_1.default('member'), validations_handler_1.default(users_schema_1.patchUserSchema), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const user = yield users_model_1.default
            .updateOne({ id: req.query.id }, { $set: req.body })
            .exec();
        return res
            .status(200)
            .json(user);
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=users.routes.js.map