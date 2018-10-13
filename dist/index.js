"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path_1 = require("path");
const users_routes_1 = require("./routes/users.routes");
dotenv.config();
const { PORT } = process.env;
const test = 'ROFL';
const app = express()
    .set('view engine', 'pug')
    .set('views', path_1.join(__dirname, 'public', 'views'))
    .use(morgan('dev'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(users_routes_1.default)
    .use((req, res) => {
    res.status(404).end();
});
http
    .createServer(app)
    .listen(PORT, (err) => {
    if (!err) {
        console.log(`SERVER RUNS ON PORT ${PORT}`);
    }
});
//# sourceMappingURL=index.js.map