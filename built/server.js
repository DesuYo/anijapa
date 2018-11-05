"use strict";
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "MongooseModel", {
  enumerable: true,
  get: function get() {
    return mongoose.Model;
  }
});
Object.defineProperty(exports, "MongooseDocument", {
  enumerable: true,
  get: function get() {
    return mongoose.Document;
  }
});
Object.defineProperty(exports, "MongooseSchema", {
  enumerable: true,
  get: function get() {
    return mongoose.Schema;
  }
});
Object.defineProperty(exports, "Request", {
  enumerable: true,
  get: function get() {
    return _express.Request;
  }
});
Object.defineProperty(exports, "Response", {
  enumerable: true,
  get: function get() {
    return _express.Response;
  }
});
Object.defineProperty(exports, "RequestHandler", {
  enumerable: true,
  get: function get() {
    return _express.RequestHandler;
  }
});
Object.defineProperty(exports, "JsonWebTokenError", {
  enumerable: true,
  get: function get() {
    return _jsonwebtoken.JsonWebTokenError;
  }
});
Object.defineProperty(exports, "TokenExpiredError", {
  enumerable: true,
  get: function get() {
    return _jsonwebtoken.TokenExpiredError;
  }
});
Object.defineProperty(exports, "ValidationErrorItem", {
  enumerable: true,
  get: function get() {
    return _joi.ValidationErrorItem;
  }
});
Object.defineProperty(exports, "JoiSchemaLike", {
  enumerable: true,
  get: function get() {
    return _joi.SchemaLike;
  }
});

var mongoose = _interopRequireWildcard(require("mongoose"));

var _express = require("express");

var _jsonwebtoken = require("jsonwebtoken");

var _joi = require("joi");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('path'),
    join = _require.join;

var dotenv = require('dotenv');

var express = require('express');

var _require2 = require('apollo-server-express'),
    ApolloServer = _require2.ApolloServer;

var _require3 = require('mongodb'),
    MongoClient = _require3.MongoClient;

var morgan = require('morgan');

var cors = require('cors');

var typeDefs = require('./schemas/index.schema');

var resolvers = require('./resolvers/index.resolvers') //const schemaDirectives = require('./directives/index.directive')
;

_asyncToGenerator(
/*#__PURE__*/
regeneratorRuntime.mark(function _callee() {
  var _process$env, PORT, NODE_ENV, MONGO_URI, DB_NAME, mongoClient, db, app, graph;

  return regeneratorRuntime.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          dotenv.config();
          _process$env = process.env, PORT = _process$env.PORT, NODE_ENV = _process$env.NODE_ENV, MONGO_URI = _process$env.MONGO_URI, DB_NAME = _process$env.DB_NAME;
          _context.next = 5;
          return MongoClient.connect(MONGO_URI, {
            useNewUrlParser: true
          });

        case 5:
          mongoClient = _context.sent;
          db = mongoClient.db(DB_NAME);
          app = express().set('view engine', 'pug').set('views', 'pages').use(morgan('dev')).use(cors()).disable('x-powered-by').get('/static', express.static(join(__dirname, 'built', 'public'))); //.get('/', (_, res) => res.sendFile(join(__dirname, 'public')))

          graph = new ApolloServer({
            typeDefs: typeDefs,
            resolvers: resolvers,
            context: function context(_ref2) {
              var req = _ref2.req;
              return {
                user: req.user,
                db: db
              };
            },
            formatError: function formatError(_ref3) {
              var message = _ref3.message,
                  extensions = _ref3.extensions;
              return {
                message: message,
                status: extensions.exception.status,
                details: extensions.exception.details
              };
            },
            playground: NODE_ENV === 'dev'
          });
          graph.applyMiddleware({
            app: app,
            path: '/graph'
          });
          app.listen(PORT || 777, function () {
            return console.log('ooooi, I am gonna poop on the plate...');
          });
          _context.next = 16;
          break;

        case 13:
          _context.prev = 13;
          _context.t0 = _context["catch"](0);
          console.log(_context.t0);

        case 16:
        case "end":
          return _context.stop();
      }
    }
  }, _callee, this, [[0, 13]]);
}))();
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

//import {  } from '../helpers/types.import'
var ID = _mongoose.Schema.Types.ObjectId;
var commentSchema = new _mongoose.Schema({
  text: String,
  userId: {
    type: ID,
    ref: 'User'
  },
  animeId: {
    type: ID,
    ref: 'Anime'
  },
  likes: [{
    type: ID,
    ref: 'User'
  }],
  replies: [{
    type: ID,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

var _default = _mongoose.default.model('comment', commentSchema);

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _users = _interopRequireDefault(require("./users.model"));

var _comments = _interopRequireDefault(require("./comments.model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = {
  users: _users.default,
  comments: _comments.default
};
exports.default = _default;
"use strict";

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var user = require('./user.resolver');

module.exports = {
  Query: _objectSpread({}, user.queries),
  Mutation: _objectSpread({}, user.mutations)
};
"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _require = require('../validations/types'),
    $SLUG = _require.$SLUG,
    $EMAIL = _require.$EMAIL,
    $PASSWORD = _require.$PASSWORD;

var Chainer = require('../validations/handler');

var jwt = require('jsonwebtoken');

module.exports = {
  queries: {
    me: function me(_, __, _ref) {
      var user = _ref.user;
      return user;
    },
    signIn: function () {
      var _signIn = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(_, _ref2, _ref3) {
        var account, password, db, users;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                account = _ref2.account, password = _ref2.password;
                db = _ref3.db;
                users = db.collection('users');
                return _context.abrupt("return", new Chainer({
                  account: account,
                  password: password
                }).addAction(function (_ref4) {
                  var account = _ref4.account;
                  return users.findOne({
                    $or: [{
                      email: account
                    }, {
                      username: account
                    }]
                  });
                }));

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      return function signIn(_x, _x2, _x3) {
        return _signIn.apply(this, arguments);
      };
    }()
  },
  mutations: {
    signUp: function () {
      var _signUp = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(_, _ref5, _ref6) {
        var email, username, rest, db, users;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                email = _ref5.email, username = _ref5.username, rest = _objectWithoutProperties(_ref5, ["email", "username"]);
                db = _ref6.db;
                users = db.collection('users');
                return _context2.abrupt("return", new Chainer(_objectSpread({
                  email: email,
                  username: username
                }, rest)).addInputValidation({
                  password: $PASSWORD(8),
                  email: $EMAIL(),
                  username: $SLUG(16)
                }).addUniqueValidation(users, {
                  email: email,
                  username: username
                }).addAction(function (user) {
                  return users.insertOne(user);
                }).exec(function (_ref7) {
                  var insertedId = _ref7.insertedId;
                  return {
                    accessToken: jwt.sign({
                      insertedId: insertedId
                    }, process.env.JWT_SECRET, {
                      expiresIn: '2h'
                    }),
                    refreshToken: jwt.sign({
                      insertedId: insertedId
                    }, process.env.JWT_SECRET)
                  };
                }));

              case 4:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      }));

      return function signUp(_x4, _x5, _x6) {
        return _signUp.apply(this, arguments);
      };
    }()
  }
};
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../services/auth.handler"));

var _ = _interopRequireWildcard(require("../services/validations.handler"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = (0, _express.Router)().post('/', (0, _auth.default)('admin'), validationHandler({}),
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var db, body;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            db = req.db, body = req.body;
            _context.t0 = res.status(201);
            _context.next = 5;
            return db['anime'].create(body);

          case 5:
            _context.t1 = _context.sent;

            _context.t0.json.call(_context.t0, _context.t1);

            _context.next = 12;
            break;

          case 9:
            _context.prev = 9;
            _context.t2 = _context["catch"](0);
            next(_context.t2);

          case 12:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 9]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = _interopRequireDefault(require("../services/auth.handler"));

var _ = _interopRequireWildcard(require("../services/validations.handler"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = (0, _express.Router)().patch('/:id/likes', (0, _auth.default)('patch:basic', 'patch:admin'),
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var db, user, params, comment, operator, result;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            db = req.db, user = req.user, params = req.params;
            _context.next = 4;
            return db['comments'].findById(params.id).exec();

          case 4:
            comment = _context.sent;
            operator = comment.toObject().likes.includes(user._id) ? '$pull' : '$push';
            _context.next = 8;
            return db['comments'].findByIdAndUpdate(params.id, _defineProperty({}, operator, {
              likes: user._id
            }), {
              new: true
            }).exec();

          case 8:
            result = _context.sent;
            return _context.abrupt("return", res.status(200).json(result));

          case 12:
            _context.prev = 12;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 15:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 12]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()).post('/', (0, _auth.default)('post:basic', 'post:admin'), _.validationHandler({
  text: _.$VARCHAR(300),
  animeId: _.$GUID(),
  replies: _.ARRAY(_.GUID()),
  likes: _.ARRAY(_.GUID())
}),
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var body, user, db, comment;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            body = req.body, user = req.user, db = req.db;
            comment = new db['comments'](_objectSpread({}, body, {
              userId: user._id
            }));
            _context2.t0 = res.status(201);
            _context2.next = 6;
            return comment.save();

          case 6:
            _context2.t1 = _context2.sent;
            return _context2.abrupt("return", _context2.t0.json.call(_context2.t0, _context2.t1));

          case 10:
            _context2.prev = 10;
            _context2.t2 = _context2["catch"](0);
            next(_context2.t2);

          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 10]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()).patch('/:id', (0, _auth.default)('patch:basic', 'patch:admin'), _.validationHandler({
  text: _.$VARCHAR(300)
}),
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var db, user, params, body, result;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            db = req.db, user = req.user, params = req.params, body = req.body;
            _context3.next = 4;
            return db['comment'].updateOne({
              _id: params.id,
              userId: user._id
            }, {
              $set: {
                text: body.text
              }
            }, {
              new: true
            }).exec();

          case 4:
            result = _context3.sent;
            return _context3.abrupt("return", res.status(result.ok < 1 ? 400 : 200).json({
              result: result
            }));

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 11:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 8]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()).delete('/:id', (0, _auth.default)('delete:basic', 'delete:admin'),
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var db, user, params, comment;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            db = req.db, user = req.user, params = req.params;
            _context4.next = 4;
            return db['comment'].deleteOne({
              _id: params.id,
              userId: user._id
            }).error();

          case 4:
            comment = _context4.sent;
            return _context4.abrupt("return", res.status(204).json(comment));

          case 8:
            _context4.prev = 8;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 11:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 8]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()).delete('/:id', (0, _auth.default)('delete:admin'),
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var db, params, comment;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            db = req.db, params = req.params;
            _context5.next = 4;
            return db['comment'].deleteOne({
              _id: params.id
            }).error();

          case 4:
            comment = _context5.sent;
            return _context5.abrupt("return", res.status(204).json(comment));

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 11:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 8]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}()).get('/', (0, _auth.default)('get:admin'),
/*#__PURE__*/
function () {
  var _ref6 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee6(req, res, next) {
    var _req$query, _req$query$text, text, _req$query$userId, userId, db, comments;

    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.prev = 0;
            _req$query = req.query, _req$query$text = _req$query.text, text = _req$query$text === void 0 ? '' : _req$query$text, _req$query$userId = _req$query.userId, userId = _req$query$userId === void 0 ? '' : _req$query$userId;
            db = req.db;
            _context6.next = 5;
            return db['comment'].find({
              text: new RegExp(".*".concat(text, ".*")),
              userId: new RegExp(".*".concat(userId, ".*"))
            });

          case 5:
            comments = _context6.sent;
            return _context6.abrupt("return", res.status(204).json(comments));

          case 9:
            _context6.prev = 9;
            _context6.t0 = _context6["catch"](0);
            next(_context6.t0);

          case 12:
          case "end":
            return _context6.stop();
        }
      }
    }, _callee6, this, [[0, 9]]);
  }));

  return function (_x16, _x17, _x18) {
    return _ref6.apply(this, arguments);
  };
}());

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _users = _interopRequireDefault(require("./users.routes"));

var _comments = _interopRequireDefault(require("./comments.routes"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _express.Router)().use('/', _users.default).use('/anime/:animeId/comments', _comments.default);

exports.default = _default;
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = require("express");

var _auth = _interopRequireWildcard(require("../services/auth.handler"));

var _validations = require("../services/validations.handler");

var _errors = require("../services/errors.handler");

var _types = require("../helpers/types.import");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _default = (0, _express.Router)().get('/me', (0, _auth.default)('get:basic', 'get:admin'),
/*#__PURE__*/
function () {
  var _ref = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee(req, res, next) {
    var user;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            user = req.user;
            return _context.abrupt("return", res.json(user));

          case 5:
            _context.prev = 5;
            _context.t0 = _context["catch"](0);
            next(_context.t0);

          case 8:
          case "end":
            return _context.stop();
        }
      }
    }, _callee, this, [[0, 5]]);
  }));

  return function (_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}()).patch('/me', (0, _auth.default)('patch:basic', 'patch:admin'), (0, _validations.validationHandler)({
  username: (0, _validations.SLUG)(16),
  photo: (0, _validations.URI)(256),
  firstName: (0, _validations.NAME)(16),
  lastName: (0, _validations.NAME)(16)
}),
/*#__PURE__*/
function () {
  var _ref2 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee2(req, res, next) {
    var db, user, body, result;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.prev = 0;
            db = req.db, user = req.user, body = req.body;
            _context2.next = 4;
            return db['users'].updateOne({
              _id: user._id
            }, {
              $set: body
            }).exec();

          case 4:
            result = _context2.sent;
            return _context2.abrupt("return", res.status(200).json({
              message: "Modified ".concat(result.ok, " document[s]")
            }));

          case 8:
            _context2.prev = 8;
            _context2.t0 = _context2["catch"](0);
            next(_context2.t0);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this, [[0, 8]]);
  }));

  return function (_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()).delete('/me', (0, _auth.default)('delete:basic', 'delete:admin'),
/*#__PURE__*/
function () {
  var _ref3 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee3(req, res, next) {
    var db, user;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            db = req.db, user = req.user;
            _context3.next = 4;
            return db['users'].deleteOne({
              _id: user._id
            }).exec();

          case 4:
            res.status(204).end();
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3["catch"](0);
            next(_context3.t0);

          case 10:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3, this, [[0, 7]]);
  }));

  return function (_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}()).get('/users', (0, _auth.default)('get:admin'),
/*#__PURE__*/
function () {
  var _ref4 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee4(req, res, next) {
    var db, query, _query$username, username, _query$firstName, firstName, _query$lastName, lastName, result;

    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.prev = 0;
            db = req.db, query = req.query;
            _query$username = query.username, username = _query$username === void 0 ? '' : _query$username, _query$firstName = query.firstName, firstName = _query$firstName === void 0 ? '' : _query$firstName, _query$lastName = query.lastName, lastName = _query$lastName === void 0 ? '' : _query$lastName;
            _context4.next = 5;
            return db['users'].find({
              username: new RegExp(".*".concat(username, ".*")),
              firstName: new RegExp(".*".concat(firstName, ".*")),
              lastName: new RegExp(".*".concat(lastName, ".*"))
            }).exec();

          case 5:
            result = _context4.sent;
            return _context4.abrupt("return", res.status(200).json(result));

          case 9:
            _context4.prev = 9;
            _context4.t0 = _context4["catch"](0);
            next(_context4.t0);

          case 12:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4, this, [[0, 9]]);
  }));

  return function (_x10, _x11, _x12) {
    return _ref4.apply(this, arguments);
  };
}()).patch('/users/:id', (0, _auth.default)('patch:admin'), (0, _validations.validationHandler)({
  permissions: (0, _validations.ARRAY)((0, _validations.ENUM)(_auth.possiblePermissions)),
  username: (0, _validations.SLUG)(16),
  photo: (0, _validations.URI)(256),
  firstName: (0, _validations.NAME)(16),
  lastName: (0, _validations.NAME)(16)
}),
/*#__PURE__*/
function () {
  var _ref5 = _asyncToGenerator(
  /*#__PURE__*/
  regeneratorRuntime.mark(function _callee5(req, res, next) {
    var db, params, body, target;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.prev = 0;
            db = req.db, params = req.params, body = req.body;
            _context5.next = 4;
            return db['users'].findById(params.id).exec();

          case 4:
            target = _context5.sent;

            if (target) {
              _context5.next = 7;
              break;
            }

            return _context5.abrupt("return", next(new _errors.NotFoundError('User not found')));

          case 7:
            if (!target.toObject().permissions.some(function (el) {
              return el === 'overlord';
            })) {
              _context5.next = 9;
              break;
            }

            return _context5.abrupt("return", next(new _errors.PermissionError()));

          case 9:
            _context5.next = 11;
            return target.update({
              $set: body
            }).exec();

          case 11:
            return _context5.abrupt("return", res.status(204).end());

          case 14:
            _context5.prev = 14;
            _context5.t0 = _context5["catch"](0);
            next(_context5.t0);

          case 17:
          case "end":
            return _context5.stop();
        }
      }
    }, _callee5, this, [[0, 14]]);
  }));

  return function (_x13, _x14, _x15) {
    return _ref5.apply(this, arguments);
  };
}());

exports.default = _default;
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n    type Query { _: Int },\n    type Mutation { _: Int },\n    type Subscription { _: Int }\n  "]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('apollo-server-express'),
    gql = _require.gql;

var User = require('./user.schema');

module.exports = [gql(_templateObject()), User];
"use strict";

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  #directive @unique on FIELD_DEFINITION\n  type User {\n    id: ID!\n    isBanned: Boolean!\n    email: String! \n    username: String! \n    googleID: ID\n    facebookID: ID\n    photo: String\n    firstName: String\n    lastName: String\n    birthday: String\n    #comments: [Comment!]\n  }\n\n  type AccessInfo {\n    accessToken: String!\n    refreshToken: String!\n  }\n\n  input UserProfileInput {\n    photo: String\n    firstName: String\n    lastName: String\n    birthday: String\n  }\n\n  extend type Query {\n    me: User!\n    signIn (account: String!, password: String!): AccessInfo\n    # only for admins\n    filterUsers (emailPattern: String, usernamePattern: String, profilePattern: UserProfileInput): [User]!\n    findUser (id: ID!): User\n  }\n\n  extend type Mutation {\n    signUp (password: String!, email: String!, username: String!): AccessInfo\n    patchMe (username: String, profile: UserProfileInput): User!\n    deleteMe (password: String): Boolean\n    # only for admins\n    banUser (id: ID!): Boolean!\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

var _require = require('apollo-server-express'),
    gql = _require.gql;

module.exports = gql(_templateObject());
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.googleCallback = exports.googleAuthorize = exports.possiblePermissions = void 0;

var _jsonwebtoken = require("jsonwebtoken");

var _users = _interopRequireDefault(require("../models/users.model"));

var httpClient = _interopRequireWildcard(require("superagent"));

var _errors = require("./errors.handler");

var _types = require("../helpers/types.import");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var possiblePermissions = ['get:basic', 'post:basic', 'patch:basic', 'delete:basic', 'get:admin', 'post:admin', 'patch:admin', 'delete:admin'];
exports.possiblePermissions = possiblePermissions;

var googleAuthorize = function googleAuthorize(scope) {
  return function (req, res, next) {
    try {
      var path = req.path;
      var GOOGLE_ID = process.env.GOOGLE_ID;
      return res.redirect('https://accounts.google.com/o/oauth2/v2/auth' + "?client_id=".concat(GOOGLE_ID) + "&redirect_uri=https://".concat(req.get('host')).concat(path, "/callback") + "&scope=".concat(scope) + "&response_type=code");
    } catch (error) {
      next(error);
    }
  };
};

exports.googleAuthorize = googleAuthorize;

var googleCallback = function googleCallback() {
  return (
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(req, res, next) {
        var path, query, db, _process$env, GOOGLE_ID, GOOGLE_SECRET, GOOGLE_OVERLORD_PROFILE_ID, JWT_SECRET, access_token, data, userDoc, id, given_name, family_name, picture;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.prev = 0;
                path = req.path, query = req.query, db = req.db;
                _process$env = process.env, GOOGLE_ID = _process$env.GOOGLE_ID, GOOGLE_SECRET = _process$env.GOOGLE_SECRET, GOOGLE_OVERLORD_PROFILE_ID = _process$env.GOOGLE_OVERLORD_PROFILE_ID, JWT_SECRET = _process$env.JWT_SECRET;
                _context.next = 5;
                return httpClient.post('https://www.googleapis.com/oauth2/v4/token').set('accept', 'application/json').set('content-type', 'application/x-www-form-urlencoded').send({
                  client_id: GOOGLE_ID,
                  client_secret: GOOGLE_SECRET,
                  code: query['code'],
                  redirect_uri: "https://".concat(req.get('host')).concat(path),
                  grant_type: 'authorization_code'
                });

              case 5:
                access_token = _context.sent.body.access_token;
                _context.next = 8;
                return httpClient.get('https://www.googleapis.com/oauth2/v1/userinfo').set('accept', 'application/json').query({
                  access_token: access_token
                });

              case 8:
                data = _context.sent.body;
                _context.next = 11;
                return db['users'].findOne({
                  googleID: data.id
                }).exec();

              case 11:
                userDoc = _context.sent;

                if (!userDoc) {
                  _context.next = 14;
                  break;
                }

                return _context.abrupt("return", res.status(200).json({
                  accessToken: (0, _jsonwebtoken.sign)({
                    _id: userDoc.toObject()._id
                  }, JWT_SECRET, {
                    expiresIn: '2d'
                  }),
                  tokenType: 'Bearer'
                }));

              case 14:
                id = data.id, given_name = data.given_name, family_name = data.family_name, picture = data.picture;
                _context.next = 17;
                return db['users'].create({
                  googleID: id,
                  permission: id == GOOGLE_OVERLORD_PROFILE_ID ? ['overlord'] : ['get:basic', 'post:basic', 'patch:basic', 'delete:basic'],
                  photo: picture,
                  firstName: given_name,
                  lastName: family_name
                });

              case 17:
                userDoc = _context.sent;
                return _context.abrupt("return", res.status(201).json({
                  accessToken: (0, _jsonwebtoken.sign)({
                    _id: userDoc.toObject()._id
                  }, JWT_SECRET, {
                    expiresIn: '2d'
                  }),
                  tokenType: 'Bearer'
                }));

              case 21:
                _context.prev = 21;
                _context.t0 = _context["catch"](0);
                return _context.abrupt("return", next(_context.t0));

              case 24:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[0, 21]]);
      }));

      return function (_x, _x2, _x3) {
        return _ref.apply(this, arguments);
      };
    }()
  );
};

exports.googleCallback = googleCallback;

var _default = function _default() {
  for (var _len = arguments.length, permissions = new Array(_len), _key = 0; _key < _len; _key++) {
    permissions[_key] = arguments[_key];
  }

  return (
    /*#__PURE__*/
    function () {
      var _ref2 = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2(req, _, next) {
        var authorization, _authorization$split, _authorization$split2, type, token, _verify, _id, userDoc, user, scope;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.prev = 0;
                authorization = req.headers.authorization;

                if (authorization) {
                  _context2.next = 4;
                  break;
                }

                return _context2.abrupt("return", next(new _types.JsonWebTokenError('Bearer token is required!')));

              case 4:
                _authorization$split = authorization.split(' '), _authorization$split2 = _slicedToArray(_authorization$split, 2), type = _authorization$split2[0], token = _authorization$split2[1];

                if (!(type !== 'Bearer')) {
                  _context2.next = 7;
                  break;
                }

                return _context2.abrupt("return", next(new _types.JsonWebTokenError('Bearer token is required!')));

              case 7:
                _verify = (0, _jsonwebtoken.verify)(token, process.env.JWT_SECRET || '難しい鍵'), _id = _verify._id;
                _context2.next = 10;
                return _users.default.findById(_id, {
                  __v: 0
                }).exec();

              case 10:
                userDoc = _context2.sent;

                if (userDoc) {
                  _context2.next = 13;
                  break;
                }

                return _context2.abrupt("return", next(new _types.JsonWebTokenError('User with this token does not exist')));

              case 13:
                user = userDoc.toObject();
                scope = user.permissions || [];

                if (scope.some(function (el) {
                  return permissions.includes(el) || el === 'overlord';
                })) {
                  _context2.next = 17;
                  break;
                }

                return _context2.abrupt("return", next(new _errors.PermissionError()));

              case 17:
                req.user = user;
                return _context2.abrupt("return", next());

              case 21:
                _context2.prev = 21;
                _context2.t0 = _context2["catch"](0);
                return _context2.abrupt("return", next(_context2.t0));

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[0, 21]]);
      }));

      return function (_x4, _x5, _x6) {
        return _ref2.apply(this, arguments);
      };
    }()
  );
};

exports.default = _default;
"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

exports.InputValidationError =
/*#__PURE__*/
function (_Error) {
  _inherits(_class, _Error);

  function _class(details) {
    var _this;

    _classCallCheck(this, _class);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(_class).call(this, 'Input validation error.'));
    _this.status = 400;
    _this.details = details;
    return _this;
  }

  return _class;
}(_wrapNativeSuper(Error));

exports.ServerError =
/*#__PURE__*/
function (_Error2) {
  _inherits(_class2, _Error2);

  function _class2(details) {
    var _this2;

    _classCallCheck(this, _class2);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(_class2).call(this, 'Server error'));
    _this2.status = 500;
    _this2.details = details;
    return _this2;
  }

  return _class2;
}(_wrapNativeSuper(Error));
/*import { JsonWebTokenError, TokenExpiredError } from '../helpers/types.import'

export class NotFoundError extends Error {
  constructor (msg) { super(msg) }
}

export class PermissionError extends Error {
  constructor () { super('Permission denied for this action.') }
}

export default (error, _, res, __) => {
  try {
    switch (true) {
      case error instanceof JsonWebTokenError || error instanceof TokenExpiredError: return res
        .status(401)
        .json({ error })

      case error instanceof PermissionError: return res
        .status(403)
        .json({ error: error.message })
        
      case error.isJoi: return res
        .status(400)
        .json(error.details.map((err) => ({
          key: err.context.key,
          message: err.message
        })))
      
      case error.name === 'MongoError' && error.code === 11000: return res
        .status(400)
        .json({ error: error.errmsg })

      case error instanceof NotFoundError: return res
        .status(404)
        .json({ error: error.message })
  
      default: throw error
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: error.message || error })
  }
}*/
"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Joi = require('joi');

var _require = require('./errors'),
    InputValidationError = _require.InputValidationError,
    ServerError = _require.ServerError;

module.exports =
/*#__PURE__*/
function () {
  function _class() {
    var input = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, _class);

    this.middlewares = [];
    this.input = input;
    this.output = input;
  }

  _createClass(_class, [{
    key: "exec",
    value: function () {
      var _exec = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var callback,
            _iteratorNormalCompletion,
            _didIteratorError,
            _iteratorError,
            _iterator,
            _step,
            mw,
            _args = arguments;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                callback = _args.length > 0 && _args[0] !== undefined ? _args[0] : null;
                _context.prev = 1;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context.prev = 5;
                _iterator = this.middlewares[Symbol.iterator]();

              case 7:
                if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                  _context.next = 18;
                  break;
                }

                mw = _step.value;
                _context.next = 11;
                return mw();

              case 11:
                _context.t0 = _context.sent;

                if (_context.t0) {
                  _context.next = 14;
                  break;
                }

                _context.t0 = this.output;

              case 14:
                this.output = _context.t0;

              case 15:
                _iteratorNormalCompletion = true;
                _context.next = 7;
                break;

              case 18:
                _context.next = 24;
                break;

              case 20:
                _context.prev = 20;
                _context.t1 = _context["catch"](5);
                _didIteratorError = true;
                _iteratorError = _context.t1;

              case 24:
                _context.prev = 24;
                _context.prev = 25;

                if (!_iteratorNormalCompletion && _iterator.return != null) {
                  _iterator.return();
                }

              case 27:
                _context.prev = 27;

                if (!_didIteratorError) {
                  _context.next = 30;
                  break;
                }

                throw _iteratorError;

              case 30:
                return _context.finish(27);

              case 31:
                return _context.finish(24);

              case 32:
                if (callback) {
                  _context.next = 34;
                  break;
                }

                return _context.abrupt("return", this.output);

              case 34:
                return _context.abrupt("return", callback(this.output));

              case 37:
                _context.prev = 37;
                _context.t2 = _context["catch"](1);

                if (_context.t2 instanceof InputValidationError) {
                  _context.next = 41;
                  break;
                }

                throw new ServerError(_context.t2.message || _context.t2);

              case 41:
                throw _context.t2;

              case 42:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this, [[1, 37], [5, 20, 24, 32], [25,, 27, 31]]);
      }));

      return function exec() {
        return _exec.apply(this, arguments);
      };
    }()
  }, {
    key: "addAction",
    value: function addAction(callback) {
      var _this = this;

      this.middlewares.push(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", callback(_this.output));

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this);
      })));
      return this;
    }
  }, {
    key: "addUniqueValidation",
    value: function addUniqueValidation(collection) {
      var fields = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.input;
      this.middlewares.push(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        var filter, doc, details;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                filter = Object.keys(fields).map(function (key) {
                  return _defineProperty({}, key, fields[key]);
                });
                _context3.next = 3;
                return collection.findOne({
                  $or: filter
                });

              case 3:
                doc = _context3.sent;

                if (!doc) {
                  _context3.next = 7;
                  break;
                }

                details = Object.keys(doc).filter(function (key) {
                  return doc[key] === fields[key];
                }).map(function (key) {
                  return {
                    key: key,
                    message: "Document with this <".concat(key, "> already exist")
                  };
                });
                throw new InputValidationError(details);

              case 7:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      })));
      return this;
    }
  }, {
    key: "addInputValidation",
    value: function addInputValidation(schema) {
      var input = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.input;
      this.middlewares.push(
      /*#__PURE__*/
      _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var _Joi$compile$options$, error, value;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                _Joi$compile$options$ = Joi.compile(schema).options({
                  abortEarly: false,
                  allowUnknown: true,
                  stripUnknown: true
                }).validate(input), error = _Joi$compile$options$.error, value = _Joi$compile$options$.value;

                if (!error) {
                  _context4.next = 3;
                  break;
                }

                throw new InputValidationError(error.details.map(function (err) {
                  return {
                    key: err.context.key,
                    message: err.message
                  };
                }));

              case 3:
                return _context4.abrupt("return", value);

              case 4:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      })));
      return this;
    }
  }]);

  return _class;
}();
"use strict";

var Joi = require('joi');

var STR = function STR(maxLength) {
  return Joi.string().trim().max(maxLength);
};

var NUM = function NUM(max) {
  return Joi.number().max(max);
};

var passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;

exports.VARCHAR = function (maxLength) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return STR(maxLength).default(def);
};

exports.$VARCHAR = function (maxLength) {
  return STR(maxLength).required();
};

exports.GUID = function () {
  var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return STR(64).guid().default(def);
};

exports.$GUID = function () {
  return STR(64).guid().required();
};

exports.ARRAY = function () {
  for (var _len = arguments.length, type = new Array(_len), _key = 0; _key < _len; _key++) {
    type[_key] = arguments[_key];
  }

  return Joi.array().items(type).default([]);
};

exports.$ARRAY = function () {
  for (var _len2 = arguments.length, type = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    type[_key2] = arguments[_key2];
  }

  return Joi.array().items(type).required();
};

exports.ENUM = function () {
  for (var _len3 = arguments.length, values = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
    values[_key3] = arguments[_key3];
  }

  return Joi.allow(values);
};

exports.$ENUM = function () {
  for (var _len4 = arguments.length, values = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
    values[_key4] = arguments[_key4];
  }

  return Joi.allow(values).required();
};

exports.SLUG = function (maxLength) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return STR(maxLength).token().lowercase().default(def);
};

exports.$SLUG = function (maxLength) {
  return STR(maxLength).token().lowercase().required();
};

exports.URI = function (maxLength) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return STR(maxLength).uri({
    allowRelative: true
  }).default(def);
};

exports.$URI = function (maxLength) {
  return STR(maxLength).uri({
    allowRelative: true
  }).required();
};

exports.NAME = function (maxLength) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return STR(maxLength).regex(/^[a-zA-Z]$/).default(def);
};

exports.$NAME = function (maxLength) {
  return STR(maxLength).regex(/^[a-zA-Z]$/).required();
};

exports.EMAIL = function () {
  var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return STR(64).email().default(def);
};

exports.$EMAIL = function () {
  return STR(64).email().required();
};

exports.PHONE = function () {
  var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).default(def);
};

exports.$PHONE = function () {
  return STR(16).replace(/\(*\)*/g, '').regex(/^\+\d{11,12}$/).required();
};

exports.PASSWORD = function (minLength) {
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return STR(64).regex(passwordRegex).min(minLength).default(def);
};

exports.$PASSWORD = function (minLength) {
  return STR(64).regex(passwordRegex).min(minLength).required();
};

exports.INT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return NUM(max).integer().default(def);
};

exports.$INT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  return NUM(max).integer().required();
};

exports.UINT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var def = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : undefined;
  return NUM(max).integer().positive().default(def);
};

exports.$UINT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  return NUM(max).integer().positive().required();
};

exports.FLOAT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  return NUM(max).precision(precision).default(def);
};

exports.$FLOAT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  return NUM(max).precision(precision).required();
};

exports.UFLOAT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var def = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
  return NUM(max).precision(precision).positive().default(def);
};

exports.$UFLOAT = function () {
  var max = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Math.pow(2, 32);
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  return NUM(max).precision(precision).positive().required();
};

exports.BOOL = function () {
  var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return Joi.boolean().default(def);
};

exports.DATE = function () {
  var def = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : undefined;
  return Joi.date().iso().default(def);
};

exports.$DATE = function () {
  return Joi.date().iso().required();
};
