"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Joi = require("joi");
exports.default = (sample, schema) => {
    try {
        const { error, value } = Joi.validate(sample, schema);
        if (error) {
            throw error.details.map((err) => ({
                key: err.context.key,
                message: err.message
            }));
        }
        else
            return value;
    }
    catch (error) {
        throw {
            status: 400,
            details: error
        };
    }
};
//# sourceMappingURL=validations.service.js.map