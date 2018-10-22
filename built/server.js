var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
System.register("models/users.model", ["mongoose"], function (exports_1, context_1) {
    "use strict";
    var mongoose_1;
    var __moduleName = context_1 && context_1.id;
    return {
        setters: [
            function (mongoose_1_1) {
                mongoose_1 = mongoose_1_1;
            }
        ],
        execute: function () {
            exports_1("default", mongoose_1.model('user', new mongoose_1.Schema({
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
            })));
        }
    };
});
System.register("models/comments.model", ["mongoose"], function (exports_2, context_2) {
    "use strict";
    var mongoose_2, GUID, commentSchema;
    var __moduleName = context_2 && context_2.id;
    return {
        setters: [
            function (mongoose_2_1) {
                mongoose_2 = mongoose_2_1;
            }
        ],
        execute: function () {
            GUID = mongoose_2.Schema.Types.ObjectId;
            commentSchema = new mongoose_2.Schema({
                text: String,
                userId: { type: GUID, ref: 'User' },
                animeId: { type: GUID, ref: 'Anime' },
                likes: [{ type: GUID, ref: 'User' }],
                replies: [{ type: GUID, ref: 'Comment' }]
            }, {
                timestamps: true
            });
            exports_2("default", mongoose_2.model('comment', commentSchema));
        }
    };
});
System.register("models/index.model", ["models/users.model", "models/comments.model"], function (exports_3, context_3) {
    "use strict";
    var users_model_1, comments_model_1;
    var __moduleName = context_3 && context_3.id;
    return {
        setters: [
            function (users_model_1_1) {
                users_model_1 = users_model_1_1;
            },
            function (comments_model_1_1) {
                comments_model_1 = comments_model_1_1;
            }
        ],
        execute: function () {
            exports_3("default", {
                users: users_model_1.default,
                comments: comments_model_1.default
            });
        }
    };
});
System.register("services/db.connection", ["mongoose", "models/index.model"], function (exports_4, context_4) {
    "use strict";
    var mongoose, index_model_1;
    var __moduleName = context_4 && context_4.id;
    return {
        setters: [
            function (mongoose_3) {
                mongoose = mongoose_3;
            },
            function (index_model_1_1) {
                index_model_1 = index_model_1_1;
            }
        ],
        execute: function () {
            exports_4("default", (req, _, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { DB_URI } = process.env;
                    yield mongoose.connect(DB_URI, { useNewUrlParser: true });
                    req.db = index_model_1.default;
                    next();
                }
                catch (error) {
                    next(error);
                }
            }));
        }
    };
});
System.register("services/auth.handler", ["jsonwebtoken", "models/users.model", "superagent"], function (exports_5, context_5) {
    "use strict";
    var jsonwebtoken_1, users_model_2, httpClient, rolesMap, PermissionError, googleAuthorize, googleCallback;
    var __moduleName = context_5 && context_5.id;
    return {
        setters: [
            function (jsonwebtoken_1_1) {
                jsonwebtoken_1 = jsonwebtoken_1_1;
            },
            function (users_model_2_1) {
                users_model_2 = users_model_2_1;
            },
            function (httpClient_1) {
                httpClient = httpClient_1;
            }
        ],
        execute: function () {
            rolesMap = {
                member: 0,
                admin: 1,
                overlord: 2
            };
            PermissionError = class PermissionError {
                constructor(msg) {
                    this.message = msg;
                }
            };
            exports_5("PermissionError", PermissionError);
            exports_5("googleAuthorize", googleAuthorize = (scope) => {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { path } = req;
                        const { GOOGLE_ID } = process.env;
                        res.redirect('https://accounts.google.com/o/oauth2/v2/auth' +
                            `?client_id=${GOOGLE_ID}` +
                            `&redirect_uri=https://${req.get('host')}${path}/callback` +
                            `&scope=${scope}` +
                            `&response_type=code`);
                    }
                    catch (error) {
                        next(error);
                    }
                });
            });
            exports_5("googleCallback", googleCallback = () => {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { path, query, db } = req;
                        const { GOOGLE_ID, GOOGLE_SECRET, JWT_SECRET } = process.env;
                        const { access_token } = (yield httpClient
                            .post('https://www.googleapis.com/oauth2/v4/token')
                            .set('accept', 'application/json')
                            .set('content-type', 'application/x-www-form-urlencoded')
                            .send({
                            client_id: GOOGLE_ID,
                            client_secret: GOOGLE_SECRET,
                            code: query['code'],
                            redirect_uri: `https://${req.get('host')}${path}`,
                            grant_type: 'authorization_code'
                        }))
                            .body;
                        const data = (yield httpClient
                            .get('https://www.googleapis.com/oauth2/v1/userinfo')
                            .set('accept', 'application/json')
                            .query({ access_token }))
                            .body;
                        let user = yield db['users']
                            .findOne({ googleID: data.id })
                            .exec();
                        if (user)
                            return res
                                .status(200)
                                .json({
                                accessToken: jsonwebtoken_1.sign({ _id: user.toObject()._id }, JWT_SECRET, { expiresIn: '2d' }),
                                tokenType: 'Bearer'
                            });
                        const { id, given_name, family_name, picture } = data;
                        user = (yield db['users']
                            .create({
                            googleID: id,
                            firstName: given_name,
                            lastName: family_name,
                            photo: picture
                        }))
                            .toObject();
                        return res
                            .status(201)
                            .json({
                            accessToken: jsonwebtoken_1.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '2d' }),
                            tokenType: 'Bearer'
                        });
                    }
                    catch (error) {
                        return next(error);
                    }
                });
            });
            exports_5("default", (role) => {
                return (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { authorization } = req.headers;
                        if (!authorization)
                            next(new jsonwebtoken_1.JsonWebTokenError('Bearer token is required!'));
                        const [type, token] = authorization.split(' ');
                        if (type !== 'Bearer')
                            next(new jsonwebtoken_1.JsonWebTokenError('Bearer token is required!'));
                        const { _id } = jsonwebtoken_1.verify(token, process.env.JWT_SECRET || '難しい鍵');
                        const doc = yield users_model_2.default
                            .findById(_id, { __v: 0 })
                            .exec();
                        if (!doc)
                            next(new jsonwebtoken_1.JsonWebTokenError('User with this token does not exist'));
                        const user = doc.toObject();
                        if (rolesMap[user.role] < rolesMap[role])
                            next(new PermissionError('Permission denied for this action'));
                        req.user = user;
                        next();
                    }
                    catch (error) {
                        next(error);
                    }
                });
            });
        }
    };
});
System.register("services/validations.handler", ["joi"], function (exports_6, context_6) {
    "use strict";
    var Joi, STR, NUM, passwordRegex, VARCHAR, $VARCHAR, GUID, $GUID, ARRAY, $ARRAY, SLUG, $SLUG, URI, $URI, NAME, $NAME, EMAIL, $EMAIL, PHONE, $PHONE, PASSWORD, $PASSWORD, INT, $INT, UINT, $UINT, FLOAT, $FLOAT, UFLOAT, $UFLOAT, BOOL, DATE, $DATE, validationHandler;
    var __moduleName = context_6 && context_6.id;
    return {
        setters: [
            function (Joi_1) {
                Joi = Joi_1;
            }
        ],
        execute: function () {
            STR = (maxLength) => Joi.string().trim().max(maxLength);
            NUM = (max) => Joi.number().max(max);
            passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
            exports_6("VARCHAR", VARCHAR = (maxLength, def = undefined) => STR(maxLength).default(def));
            exports_6("$VARCHAR", $VARCHAR = (maxLength) => STR(maxLength).required());
            exports_6("GUID", GUID = (def = undefined) => STR(64).guid().default(def));
            exports_6("$GUID", $GUID = () => STR(64).guid().required());
            exports_6("ARRAY", ARRAY = (...type) => Joi.array().items(type).default([]));
            exports_6("$ARRAY", $ARRAY = (...type) => Joi.array().items(type).required());
            exports_6("SLUG", SLUG = (maxLength, def = undefined) => STR(maxLength).token().lowercase().default(def));
            exports_6("$SLUG", $SLUG = (maxLength) => STR(maxLength).token().lowercase().required());
            exports_6("URI", URI = (maxLength, def = undefined) => STR(maxLength).uri({ allowRelative: true }).default(def));
            exports_6("$URI", $URI = (maxLength) => STR(maxLength).uri({ allowRelative: true }).required());
            exports_6("NAME", NAME = (maxLength, def = undefined) => STR(maxLength).regex(/^[a-zA-Z]$/).default(def));
            exports_6("$NAME", $NAME = (maxLength) => STR(maxLength).regex(/^[a-zA-Z]$/).required());
            exports_6("EMAIL", EMAIL = (def = undefined) => STR(64).email().default(def));
            exports_6("$EMAIL", $EMAIL = () => STR(64).email().required());
            exports_6("PHONE", PHONE = (def = undefined) => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).default(def));
            exports_6("$PHONE", $PHONE = () => STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).required());
            exports_6("PASSWORD", PASSWORD = (minLength, def = undefined) => STR(64).regex(passwordRegex).min(minLength).default(def));
            exports_6("$PASSWORD", $PASSWORD = (minLength) => STR(64).regex(passwordRegex).min(minLength).required());
            exports_6("INT", INT = (max = Math.pow(2, 32), def = undefined) => NUM(max).integer().default(def));
            exports_6("$INT", $INT = (max = Math.pow(2, 32)) => NUM(max).integer().required());
            exports_6("UINT", UINT = (max = Math.pow(2, 32), def = undefined) => NUM(max).integer().positive().default(def));
            exports_6("$UINT", $UINT = (max = Math.pow(2, 32)) => NUM(max).integer().positive().required());
            exports_6("FLOAT", FLOAT = (max = Math.pow(2, 32), precision = 3, def = undefined) => NUM(max).precision(precision).default(def));
            exports_6("$FLOAT", $FLOAT = (max = Math.pow(2, 32), precision = 3) => NUM(max).precision(precision).required());
            exports_6("UFLOAT", UFLOAT = (max = Math.pow(2, 32), precision = 3, def = undefined) => NUM(max).precision(precision).positive().default(def));
            exports_6("$UFLOAT", $UFLOAT = (max = Math.pow(2, 32), precision = 3) => NUM(max).precision(precision).positive().required());
            exports_6("BOOL", BOOL = (def = undefined) => Joi.boolean().default(def));
            exports_6("DATE", DATE = (def = undefined) => Joi.date().iso().default(def));
            exports_6("$DATE", $DATE = () => Joi.date().iso().required());
            exports_6("validationHandler", validationHandler = (sample) => {
                return (req, _, next) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        const { error, value } = Joi
                            .compile(sample)
                            .options({
                            abortEarly: false,
                            allowUnknown: true,
                            stripUnknown: true
                        })
                            .validate(req.body);
                        if (error)
                            next(error);
                        req.body = value;
                        return next();
                    }
                    catch (error) {
                        next(error);
                    }
                });
            });
        }
    };
});
System.register("routes/users.routes", ["express", "services/auth.handler", "services/validations.handler", "jsonwebtoken", "bcryptjs"], function (exports_7, context_7) {
    "use strict";
    var express_1, auth_handler_1, _, jsonwebtoken_2, bcryptjs_1;
    var __moduleName = context_7 && context_7.id;
    return {
        setters: [
            function (express_1_1) {
                express_1 = express_1_1;
            },
            function (auth_handler_1_1) {
                auth_handler_1 = auth_handler_1_1;
            },
            function (_1) {
                _ = _1;
            },
            function (jsonwebtoken_2_1) {
                jsonwebtoken_2 = jsonwebtoken_2_1;
            },
            function (bcryptjs_1_1) {
                bcryptjs_1 = bcryptjs_1_1;
            }
        ],
        execute: function () {
            exports_7("default", express_1.Router()
                .post('/signup', _.validationHandler({
                username: _.$SLUG(16),
                email: _.$EMAIL(),
                password: _.$PASSWORD(8)
            }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, body } = req;
                    const { _id } = (yield db['users']
                        .create(Object.assign({}, body, { password: bcryptjs_1.hashSync(body.password) })))
                        .toObject();
                    return res
                        .status(201)
                        .json({ token: jsonwebtoken_2.sign({ _id }, process.env.JWT_SECRET || '難しい鍵') });
                }
                catch (error) {
                    next(error);
                }
            }))
                .patch('/me', auth_handler_1.default('member'), _.validationHandler({
                password: _.$VARCHAR(256),
                username: _.SLUG(16),
                firstName: _.NAME(16),
                lastName: _.NAME(16),
                birthDate: _.DATE(),
                photo: _.URI(256)
            }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, user, body } = req;
                    const result = yield db['users']
                        .updateOne({ _id: user._id }, { $set: body })
                        .exec();
                    return res
                        .status(200)
                        .json({ message: `Modified ${result.ok} document[s]` });
                }
                catch (error) {
                    next(error);
                }
            }))
                .get('/me', auth_handler_1.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { user } = req;
                    return res
                        .status(200)
                        .json(user);
                }
                catch (error) {
                    next(error);
                }
            })));
        }
    };
});
System.register("routes/comments.routes", ["express", "services/auth.handler", "services/validations.handler"], function (exports_8, context_8) {
    "use strict";
    var express_2, auth_handler_2, _;
    var __moduleName = context_8 && context_8.id;
    return {
        setters: [
            function (express_2_1) {
                express_2 = express_2_1;
            },
            function (auth_handler_2_1) {
                auth_handler_2 = auth_handler_2_1;
            },
            function (_2) {
                _ = _2;
            }
        ],
        execute: function () {
            exports_8("default", express_2.Router()
                .patch('/:id/likes', auth_handler_2.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, user, params } = req;
                    const comment = yield db['comments']
                        .findById(params.id)
                        .exec();
                    const operator = comment.toObject().likes.includes(user._id) ? '$pull' : '$push';
                    const result = yield db['comments']
                        .findByIdAndUpdate(params.id, {
                        [operator]: { likes: user._id }
                    }, { new: true })
                        .exec();
                    return res
                        .status(200)
                        .json(result);
                }
                catch (error) {
                    next(error);
                }
            }))
                .post('/', auth_handler_2.default('member'), _.validationHandler({
                text: _.$VARCHAR(300),
                animeId: _.$GUID(),
                replies: _.ARRAY(_.GUID()),
                likes: _.ARRAY(_.GUID())
            }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { body, user, db } = req;
                    return res
                        .status(201)
                        .json(yield db['comments'].create(Object.assign({}, body, { userId: user._id })));
                }
                catch (error) {
                    next(error);
                }
            }))
                .patch('/:id', auth_handler_2.default('member'), _.validationHandler({
                text: _.$VARCHAR(300)
            }), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, user, params, body } = req;
                    const result = yield db['comment']
                        .updateOne({ _id: params.id, userId: user._id }, { $set: { text: body.text } }, { new: true })
                        .exec();
                    return res
                        .status(result.ok < 1 ? 400 : 200)
                        .json({ result });
                }
                catch (error) {
                    next(error);
                }
            }))
                .delete('/:id', auth_handler_2.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, user, params, body } = req;
                    const comment = yield db['comment']
                        .deleteOne({
                        _id: params.id,
                        userId: user._id
                    }).error();
                    return res
                        .status(200)
                        .json(comment);
                }
                catch (error) {
                    next(error);
                }
            })));
        }
    };
});
System.register("routes/index.routes", ["express", "routes/users.routes", "routes/comments.routes"], function (exports_9, context_9) {
    "use strict";
    var express_3, users_routes_1, comments_routes_1;
    var __moduleName = context_9 && context_9.id;
    return {
        setters: [
            function (express_3_1) {
                express_3 = express_3_1;
            },
            function (users_routes_1_1) {
                users_routes_1 = users_routes_1_1;
            },
            function (comments_routes_1_1) {
                comments_routes_1 = comments_routes_1_1;
            }
        ],
        execute: function () {
            exports_9("default", express_3.Router()
                .use('/', users_routes_1.default)
                .use('/anime/:animeId/comments', comments_routes_1.default));
        }
    };
});
System.register("services/errors.handler", ["jsonwebtoken", "services/auth.handler"], function (exports_10, context_10) {
    "use strict";
    var jsonwebtoken_3, auth_handler_3;
    var __moduleName = context_10 && context_10.id;
    return {
        setters: [
            function (jsonwebtoken_3_1) {
                jsonwebtoken_3 = jsonwebtoken_3_1;
            },
            function (auth_handler_3_1) {
                auth_handler_3 = auth_handler_3_1;
            }
        ],
        execute: function () {
            exports_10("default", (error, _, res, __) => {
                try {
                    switch (true) {
                        case error instanceof jsonwebtoken_3.JsonWebTokenError || error instanceof jsonwebtoken_3.TokenExpiredError: return res
                            .status(401)
                            .json({ error });
                        case error instanceof auth_handler_3.PermissionError: return res
                            .status(403)
                            .json({ error });
                        case error.isJoi: return res
                            .status(400)
                            .json(error.details.map((err) => ({
                            key: err.context.key,
                            message: err.message
                        })));
                        case error.name === 'MongoError' && error.code === 11000: return res
                            .status(400)
                            .json({ error: error.errmsg });
                        default: throw error;
                    }
                }
                catch (error) {
                    return res
                        .status(500)
                        .json({ error: error.message || error });
                }
            });
        }
    };
});
System.register("index", ["dotenv", "express", "body-parser", "cors", "morgan", "path", "services/db.connection", "services/auth.handler", "routes/index.routes", "services/errors.handler"], function (exports_11, context_11) {
    "use strict";
    var dotenv, express, bodyParser, cors, morgan, path_1, db_connection_1, auth_handler_4, index_routes_1, errors_handler_1, _a, PORT;
    var __moduleName = context_11 && context_11.id;
    return {
        setters: [
            function (dotenv_1) {
                dotenv = dotenv_1;
            },
            function (express_4) {
                express = express_4;
            },
            function (bodyParser_1) {
                bodyParser = bodyParser_1;
            },
            function (cors_1) {
                cors = cors_1;
            },
            function (morgan_1) {
                morgan = morgan_1;
            },
            function (path_1_1) {
                path_1 = path_1_1;
            },
            function (db_connection_1_1) {
                db_connection_1 = db_connection_1_1;
            },
            function (auth_handler_4_1) {
                auth_handler_4 = auth_handler_4_1;
            },
            function (index_routes_1_1) {
                index_routes_1 = index_routes_1_1;
            },
            function (errors_handler_1_1) {
                errors_handler_1 = errors_handler_1_1;
            }
        ],
        execute: function () {
            dotenv.config();
            _a = process.env.PORT, PORT = _a === void 0 ? 777 : _a;
            exports_11("default", express()
                .use(morgan('dev'))
                .use(cors())
                .use(express.static(path_1.join(__dirname, '..', 'client')))
                .use(bodyParser.json())
                .use(bodyParser.urlencoded({ extended: true }))
                .use(db_connection_1.default)
                .get('/google', auth_handler_4.googleAuthorize('https://www.googleapis.com/auth/userinfo.profile'))
                .all('/google/callback', auth_handler_4.googleCallback())
                .use('/api', index_routes_1.default)
                .use((_, res) => {
                return res
                    .status(200)
                    .sendFile('/index.html');
            })
                .use(errors_handler_1.default)
                .listen(PORT, () => console.log(`I'm gonna poop on the plate, bratok...`)));
        }
    };
});
System.register("helpers/types.extend", [], function (exports_12, context_12) {
    "use strict";
    var __moduleName = context_12 && context_12.id;
    return {
        setters: [],
        execute: function () {
        }
    };
});
System.register("routes/anime.routes", ["express", "services/auth.handler", "services/validations.handler"], function (exports_13, context_13) {
    "use strict";
    var express_5, auth_handler_5, _;
    var __moduleName = context_13 && context_13.id;
    return {
        setters: [
            function (express_5_1) {
                express_5 = express_5_1;
            },
            function (auth_handler_5_1) {
                auth_handler_5 = auth_handler_5_1;
            },
            function (_3) {
                _ = _3;
            }
        ],
        execute: function () {
            exports_13("default", express_5.Router()
                .post('/', auth_handler_5.default('admin'), _.validationHandler({}), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const { db, body } = req;
                    res
                        .status(201)
                        .json(yield db['anime'].create(body));
                }
                catch (error) {
                    next(error);
                }
            })));
        }
    };
});
//# sourceMappingURL=server.js.map