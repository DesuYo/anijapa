"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = require("./users.routes");
exports.default = express_1.Router()
    .use('/users', users_routes_1.default);
//# sourceMappingURL=index.routes.js.map