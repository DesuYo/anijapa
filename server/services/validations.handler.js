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
const Joi = require("joi");
const STR = (maxLength) => Joi.string().trim().max(maxLength);
const NUM = (max) => Joi.number().max(max);
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
exports.VARCHAR = (maxLength, def = undefined) => STR(maxLength).default(def);
exports.$VARCHAR = (maxLength) => STR(maxLength).required();
exports.GUID = (def = undefined) => STR(64).guid().default(def);
exports.$GUID = () => STR(64).guid().required();
exports.ARRAY = (...type) => Joi.array().items(type).default([]);
exports.$ARRAY = (...type) => Joi.array().items(type).required();
exports.SLUG = (maxLength, def = undefined) => STR(maxLength).token().lowercase().default(def);
exports.$SLUG = (maxLength) => STR(maxLength).token().lowercase().required();
exports.URI = (maxLength, def = undefined) => STR(maxLength).uri({ allowRelative: true }).default(def);
exports.$URI = (maxLength) => STR(maxLength).uri({ allowRelative: true }).required();
exports.NAME = (maxLength, def = undefined) => STR(maxLength).regex(/^[a-zA-Z]$/).default(def);
exports.$NAME = (maxLength) => STR(maxLength).regex(/^[a-zA-Z]$/).required();
exports.EMAIL = (def = undefined) => STR(64).email().default(def);
exports.$EMAIL = () => STR(64).email().required();
exports.PHONE = (def = undefined) => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).default(def);
exports.$PHONE = () => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).required();
exports.PASSWORD = (minLength, def = undefined) => STR(64).regex(passwordRegex).min(minLength).default(def);
exports.$PASSWORD = (minLength) => STR(64).regex(passwordRegex).min(minLength).required();
exports.INT = (max = Math.pow(2, 32), def = undefined) => NUM(max).integer().default(def);
exports.$INT = (max = Math.pow(2, 32)) => NUM(max).integer().required();
exports.UINT = (max = Math.pow(2, 32), def = undefined) => NUM(max).integer().positive().default(def);
exports.$UINT = (max = Math.pow(2, 32)) => NUM(max).integer().positive().required();
exports.FLOAT = (max = Math.pow(2, 32), precision = 3, def = undefined) => NUM(max).precision(precision).default(def);
exports.$FLOAT = (max = Math.pow(2, 32), precision = 3) => NUM(max).precision(precision).required();
exports.UFLOAT = (max = Math.pow(2, 32), precision = 3, def = undefined) => NUM(max).precision(precision).positive().default(def);
exports.$UFLOAT = (max = Math.pow(2, 32), precision = 3) => NUM(max).precision(precision).positive().required();
exports.BOOL = (def = undefined) => Joi.boolean().default(def);
exports.DATE = (def = undefined) => Joi.date().iso().default(def);
exports.$DATE = () => Joi.date().iso().required();
exports.validationHandler = (sample) => {
    return (req, _, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = Joi
                .compile(sample)
                .options({
                abortEarly: false,
                allowUnknown: true,
                stripUnknown: true
            })
                .validate(req.body);
            if (error)
                next(error);
            req.body = value;
            return next();
        }
        catch (error) {
            next(error);
        }
    });
};
