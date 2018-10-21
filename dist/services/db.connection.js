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
const mongoose = require("mongoose");
const index_model_1 = require("../models/index.model");
exports.default = (req, _, next) => __awaiter(this, void 0, void 0, function* () {
    try {
        yield mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/test', { useNewUrlParser: true });
        req.db = index_model_1.default;
        next();
    }
    catch (error) {
        next(error);
    }
});
//# sourceMappingURL=db.connection.js.map