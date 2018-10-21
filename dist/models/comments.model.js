"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GUID = mongoose_1.Schema.Types.ObjectId;
const commentSchema = new mongoose_1.Schema({
    text: String,
    userId: { type: GUID, ref: 'User' },
    animeId: { type: GUID, ref: 'Anime' },
    likes: [{ type: GUID, ref: 'User' }],
    replies: [{ type: GUID, ref: 'Comment' }]
}, {
    timestamps: true
});
exports.default = mongoose_1.model('comment', commentSchema);
//# sourceMappingURL=comments.model.js.map