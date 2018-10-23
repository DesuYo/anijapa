"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const path_1 = require("path");
const db_connection_1 = require("./services/db.connection");
const auth_handler_1 = require("./services/auth.handler");
const index_routes_1 = require("./routes/index.routes");
const errors_handler_1 = require("./services/errors.handler");
dotenv.config();
console.log('test');
exports.default = express()
    .use(morgan('dev'))
    .use(cors())
    .use(express.static(path_1.join(__dirname, '..', 'client')))
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))
    .use(db_connection_1.default)
    .get('/google', auth_handler_1.googleAuthorize('https://www.googleapis.com/auth/userinfo.profile'))
    .all('/google/callback', auth_handler_1.googleCallback())
    .use('/api', index_routes_1.default)
    .use((_, res) => {
    return res
        .status(200)
        .sendFile('/index.html');
})
    .use(errors_handler_1.default)
    .listen(process.env.PORT, () => console.log(`I'm gonna poop on the plate, bratok...`));
