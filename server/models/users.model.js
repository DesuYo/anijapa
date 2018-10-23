"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.default = mongoose_1.model('user', new mongoose_1.Schema({
    googleID: { type: String, unique: true },
    username: { type: String, sparse: true },
    firstName: String,
    lastName: String,
    birthDate: Date,
    photo: String
}, {
    timestamps: true
})
    .pre("save", () => {
}));
