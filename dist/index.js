"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path_1 = require("path");
const users_routes_1 = require("./routes/users.routes");
const dotenv_1 = require("dotenv");
dotenv_1.config();
express()
    .set('view engine', 'pug')
    .set('views', path_1.join(__dirname, 'public', 'views'))
    .use(morgan('dev'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(users_routes_1.default)
    .use((req, res) => {
    res.status(404).end();
})
    .listen(777, () => {
    console.log('Listen listen');
});
//# sourceMappingURL=index.js.map