import mongoose from "mongoose";

// Who did something: any signed-in account. `type` is user (customer), company, freelancer, or admin
// (shown as "Plumber Finder"); `id` is that account's id. One reaction per account per post/comment.
const actorFields = {
  accountType: { type: String, enum: ["user", "company", "freelancer", "admin"], required: true },
  account: { type: mongoose.Schema.Types.ObjectId, required: true },
};

// A like (1) or dislike (-1) on a blog post. `post` is "company:<id>", "freelancer:<id>", "platform:<id>", or "demo:<plumber>--<slug>".
const blogReactionSchema = new mongoose.Schema({ post: { type: String, required: true }, ...actorFields, value: { type: Number, enum: [1, -1], required: true } }, { timestamps: true, collection: "blog_reactions" });
blogReactionSchema.index({ post: 1, accountType: 1, account: 1 }, { unique: true });
blogReactionSchema.index({ post: 1, value: 1 });
export const BlogReaction = mongoose.model("BlogReaction", blogReactionSchema);

// A comment or reply. Replies all belong to a top-level comment (`root`); `parent` is the comment answered,
// and `replyTo` names its author ("@Sam"). Counters are kept in step with BlogCommentReaction.
const blogCommentSchema = new mongoose.Schema({
  post: { type: String, required: true },
  root: { type: mongoose.Schema.Types.ObjectId, default: null },
  parent: { type: mongoose.Schema.Types.ObjectId, default: null },
  author: { ...actorFields, name: { type: String, required: true, trim: true, maxlength: 150 } },
  replyTo: { comment: mongoose.Schema.Types.ObjectId, name: String, accountType: String, account: mongoose.Schema.Types.ObjectId },
  body: { type: String, trim: true, maxlength: 2000, default: "" },
  edited: { type: Boolean, default: false },
  editedAt: Date,
  // A deleted top-level comment that still has replies keeps its place, shown as "[deleted]".
  deleted: { type: Boolean, default: false },
  likes: { type: Number, default: 0, min: 0 },
  dislikes: { type: Number, default: 0, min: 0 },
  score: { type: Number, default: 0 },
  replyCount: { type: Number, default: 0, min: 0 },
}, { timestamps: true, collection: "blog_comments" });
blogCommentSchema.index({ post: 1, root: 1, createdAt: -1 });
blogCommentSchema.index({ post: 1, root: 1, score: -1 });
export const BlogComment = mongoose.model("BlogComment", blogCommentSchema);

const blogCommentReactionSchema = new mongoose.Schema({ comment: { type: mongoose.Schema.Types.ObjectId, required: true }, ...actorFields, value: { type: Number, enum: [1, -1], required: true } }, { timestamps: true, collection: "blog_comment_reactions" });
blogCommentReactionSchema.index({ comment: 1, accountType: 1, account: 1 }, { unique: true });
export const BlogCommentReaction = mongoose.model("BlogCommentReaction", blogCommentReactionSchema);
