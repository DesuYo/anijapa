"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const auth_handler_1 = require("./auth.handler");
exports.default = (error, _, res, __) => {
    try {
        switch (true) {
            case error instanceof jsonwebtoken_1.JsonWebTokenError || error instanceof jsonwebtoken_1.TokenExpiredError: return res
                .status(401)
                .json({ error });
            case error instanceof auth_handler_1.PermissionError: return res
                .status(403)
                .json({ error });
            case error.isJoi: return res
                .status(400)
                .json(error.details.map((err) => ({
                key: err.context.key,
                message: err.message
            })));
            case error.name === 'MongoError' && error.code === 11000: return res
                .status(400)
                .json({ error: error.errmsg });
            default: throw error;
        }
    }
    catch (error) {
        return res
            .status(500)
            .json({ error: error.message || error });
    }
};
