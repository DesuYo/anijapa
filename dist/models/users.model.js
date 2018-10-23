"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('user', new mongoose_1.Schema({
    username: { type: String, unique: true },
    email: { type: String, unique: true },
    password: String
}, {
    timestamps: true
})
    .pre("save", () => {
}));
//# sourceMappingURL=users.model.js.map