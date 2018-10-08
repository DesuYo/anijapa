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
module.exports = (sample) => {
    return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const { error, value } = sample
                .options({
                abortEarly: false,
                allowUnknown: true
            })
                .validate(req.body);
            if (error)
                return res
                    .status(400)
                    .json(error.details.map((err) => ({
                    key: err.context.key,
                    message: err.message
                })));
            else {
                req.body = value;
                return next();
            }
        }
        catch (error) {
        }
    });
};
//# sourceMappingURL=validations.service.js.map