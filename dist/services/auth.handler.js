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
const jsonwebtoken_1 = require("jsonwebtoken");
const users_model_1 = require("../models/users.model");
const rolesMap = {
    member: 0,
    admin: 1,
    overlord: 2
};
class PermissionError {
    constructor(msg) {
        this.message = msg;
    }
}
exports.PermissionError = PermissionError;
exports.default = (role) => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const [type, token] = req.headers.authorization.split(' ');
            if (type !== 'Bearer')
                next(new jsonwebtoken_1.JsonWebTokenError('Bearer token is required!'));
            const { id } = jsonwebtoken_1.verify(token, process.env.JWT_SECRET || '難しい鍵');
            const doc = yield users_model_1.default
                .findById(id)
                .select('-password');
            const user = doc.toObject();
            if (!user)
                next(new jsonwebtoken_1.JsonWebTokenError('User with this token does not exist'));
            if (rolesMap[user.role] < rolesMap[role])
                next(new PermissionError('Permission denied for this action'));
            req.query.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
//# sourceMappingURL=auth.handler.js.map