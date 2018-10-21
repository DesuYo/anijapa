"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_handler_1 = require("../services/auth.handler");
const _ = require("../services/validations.handler");
exports.default = express_1.Router()
    .patch('/:id/likes', auth_handler_1.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    .post('/', auth_handler_1.default('member'), _.validationHandler({
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
    .patch('/:id', auth_handler_1.default('member'), _.validationHandler({
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
    .delete('/:id', auth_handler_1.default('member'), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
}));
/*.patch(
  '/:id/likes',
  authHandler('member'),
  async (req: Request, res: Response, next: Function) => {
    try {
      const comment = (await Comments.findOne({
        _id: req.params.id
      })).toObject()

      const { _id } = req.query.user
      if (comment.likes.includes(_id)) {
        throw new Error('Like has already been posted')
      }
      const likedComment = Comments.updateOne({
        _id: req.params.id}, {
        $push: {
          likes: _id
        }
      })

      return res
        .status(200)
        .json(likedComment)
    }
    catch (error) {
      next(error)
    }
  }
)

.delete(
  '/:id/likes',
  authHandler('member'),
  async (req: Request, res: Response, next: Function) => {
    try {
      const comment = (await Comments.findOne({
        _id: req.params.id
      })).toObject()

      const { _id } = req.query.user
      if (!comment.likes.includes(_id)) {
        throw new Error('Like has not been posted yet')
      }
      const likedComment = Comments.updateOne({
        _id: req.params.id}, {
        $pull: {
          likes: _id
        }
      })

      return res
        .status(200)
        .json(likedComment)
    }
    catch (error) {
      next(error)
    }
  }
)

.delete(
  '/',
  authHandler('admin'),
  _.validationsHandler({
    id: _.$GUID()
  }),
  async (req: Request, res: Response, next: Function) => {
    try {
      const comment = await Comments
        .findByIdAndRemove(req.body.id)

    return res
      .status(200)
      .json(comment)
    }
    catch (error) {
      next(error)
    }
  }
)

.get(
  '/',
  authHandler('admin'),
  async (req: Request, res: Response, next: Function) => {
    try {
      const { text = '', ...rest } = req.query

      const comments = await Comments
        .find({
          text: new RegExp('.*' + text + '.*', 'i'),
          rest
        })

      return res
        .status(200)
        .json(comments)
    }
    catch (error) {
      next(error)
    }
  }

)*/ 
//# sourceMappingURL=comments.routes.js.map