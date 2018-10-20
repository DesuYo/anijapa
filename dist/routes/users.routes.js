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
const _ = require("../services/validations.handler");
const jsonwebtoken_1 = require("jsonwebtoken");
const bcryptjs_1 = require("bcryptjs");
exports.default = express_1.Router()
    .post('/signup', _.validationHandler({
    username: _.$SLUG(16),
    email: _.$EMAIL(),
    password: _.$PASSWORD(8)
}), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { db, body } = req;
        const { _id } = (yield db['users']
            .create(Object.assign({}, body, { password: bcryptjs_1.hashSync(body.password) })))
            .toObject();
        return res
            .status(201)
            .json({ token: jsonwebtoken_1.sign({ _id }, process.env.JWT_SECRET || '難しい鍵') });
    }
    catch (error) {
        next(error);
    }
}))
    .patch('/me', auth_handler_1.default('member'), _.validationHandler({
    password: _.$VARCHAR(256),
    username: _.SLUG(16),
    firstName: _.NAME(16),
    lastName: _.NAME(16),
    birthDate: _.DATE(),
    photo: _.URI(256)
}), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { db, user, body } = req;
        const result = yield db['users']
            .updateOne({ _id: user._id }, { $set: body })
            .exec();
        return res
            .status(200)
            .json({ message: `Modified ${result.ok} document[s]` });
    }
    catch (error) {
        next(error);
    }
}))
    .get('/me', auth_handler_1.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { user } = req;
        return res
            .status(200)
            .json(user);
    }
    catch (error) {
        next(error);
    }
}));
//# sourceMappingURL=users.routes.js.map