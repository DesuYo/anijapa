"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path_1 = require("path");
const users_routes_1 = require("./routes/users.routes");
const errors_handler_1 = require("./services/errors.handler");
dotenv.config();
exports.default = express()
    .set('view engine', 'pug')
    .set('views', path_1.join(__dirname, 'public', 'views'))
    .use(morgan('dev'))
    .use(cors())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use('/api', users_routes_1.default)
    .use((req, res) => {
    res
        .status(404)
        .end();
})
    .use(errors_handler_1.default)
    .listen(process.env.PORT, () => console.log(`I'm gonna poop on the plate, bratok...`));
//# sourceMappingURL=index.js.map