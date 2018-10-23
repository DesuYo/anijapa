"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.VARCHAR = (length) => Joi.string().trim().max(length);
exports.LABEL = (length) => Joi.string().trim().regex(/^[a-zA-Z0-9\!\?\.\, ]*$/).max(length);
exports.SLUG = (length) => Joi.string().trim().token().lowercase().max(length);
exports.URI = (length) => Joi.string().trim().uri({ allowRelative: true });
exports.NAME = (length) => Joi.string().trim().regex(/^[a-zA-Z]$/);
exports.INT = Joi.number().integer();
exports.UINT = Joi.number().integer().positive();
exports.FLOAT = Joi.number().precision(3);
exports.UFLOAT = Joi.number().precision(3).positive();
exports.DATE = Joi.date().iso();
exports.PHONE = Joi.string().trim().replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/);
exports.EMAIL = Joi.string().trim().email();
//# sourceMappingURL=types.schema.js.map