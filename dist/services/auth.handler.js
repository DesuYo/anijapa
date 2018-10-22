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
const httpClient = require("superagent");
const rolesMap = {
    member: 0,
    admin: 1,
    overlord: 2
};
class OAuthError extends Error {
    constructor(msg) {
        super(msg);
    }
}
exports.OAuthError = OAuthError;
class PermissionError {
    constructor(msg) {
        this.message = msg;
    }
}
exports.PermissionError = PermissionError;
exports.googleAuthorize = (scope) => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { protocol, path } = req;
            const { GOOGLE_ID } = process.env;
            res.redirect('https://accounts.google.com/o/oauth2/v2/auth' +
                `?client_id=${GOOGLE_ID}` +
                `&redirect_uri=https://${req.get('host')}${path}/callback` +
                `&scope=${scope}` +
                `&response_type=code`);
        }
        catch (error) {
            next(error);
        }
    });
};
exports.googleCallback = () => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { protocol, path, query, db } = req;
            const { GOOGLE_ID, GOOGLE_SECRET, JWT_SECRET } = process.env;
            if (!query['code'])
                return next(new OAuthError('Missing authorization code.'));
            const { access_token } = (yield httpClient
                .post('https://www.googleapis.com/oauth2/v4/token')
                .set('accept', 'application/json')
                .set('content-type', 'application/x-www-form-urlencoded')
                .send({
                client_id: GOOGLE_ID,
                client_secret: GOOGLE_SECRET,
                code: query['code'],
                redirect_uri: `https://${req.get('host')}${path}`,
                grant_type: 'authorization_code'
            }))
                .body;
            const data = (yield httpClient
                .get('https://www.googleapis.com/oauth2/v1/userinfo')
                .set('accept', 'application/json')
                .query({ access_token }))
                .body;
            let user = yield db['users']
                .findOne({ googleID: data.id })
                .exec();
            if (user)
                return res
                    .status(200)
                    .json({ token: jsonwebtoken_1.sign({ _id: user.toObject()._id }, JWT_SECRET) });
            const { id, given_name, family_name, picture } = data;
            user = (yield db['users']
                .create({
                googleID: id,
                firstName: given_name,
                lastName: family_name,
                photo: picture
            }))
                .toObject();
            return res
                .status(201)
                .json({ token: jsonwebtoken_1.sign({ _id: user._id }, JWT_SECRET) });
        }
        catch (error) {
            return next(error);
        }
    });
};
exports.default = (role) => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const [type, token] = req.headers.authorization.split(' ');
            if (type !== 'Bearer')
                next(new jsonwebtoken_1.JsonWebTokenError('Bearer token is required!'));
            const { _id } = jsonwebtoken_1.verify(token, process.env.JWT_SECRET || '難しい鍵');
            const doc = yield users_model_1.default
                .findById(_id, { __v: 0 })
                .exec();
            if (!doc)
                next(new jsonwebtoken_1.JsonWebTokenError('User with this token does not exist'));
            const user = doc.toObject();
            if (rolesMap[user.role] < rolesMap[role])
                next(new PermissionError('Permission denied for this action'));
            req.user = user;
            next();
        }
        catch (error) {
            next(error);
        }
    });
};
//# sourceMappingURL=auth.handler.js.map