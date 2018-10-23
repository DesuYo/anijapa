"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_routes_1 = require("./users.routes");
const comments_routes_1 = require("./comments.routes");
exports.default = express_1.Router()
    .use('/', users_routes_1.default)
    .use('/anime/:animeId/comments', comments_routes_1.default);
