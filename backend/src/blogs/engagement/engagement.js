import mongoose from "mongoose";
import { Router } from "express";
import { Admin } from "../../auth/admin/models/Admin.js";
import { verifyAccessToken } from "../../auth/shared/services/tokens.js";
import { notifyAdmins, notifyProvider } from "../../shared/notifications/AccountNotification.js";
import { notify as notifyCustomer } from "../../user/notifications/services/notify.js";
import { BlogComment, BlogCommentReaction, BlogReaction } from "./models.js";
import { CompanyBlog } from "../../company/blogs/models/CompanyBlog.js";
import { FreelancerBlog } from "../../freelancer/blogs/models/FreelancerBlog.js";
import { PlatformBlog } from "../models/PlatformBlog.js";
import { displayName, isOwner, resolvePost } from "./posts.js";
import { BlogPostStats, isBot, recordView, statsFor, viewerOf } from "./views.js";
import { actorOf, recordActivity } from "../../activity/recordActivity.js";

// Likes/dislikes and comments on blog posts (company, freelancer, Plumber Finder, and sample posts).
// Anyone can read; any signed-in account (customer, company, freelancer, admin) can react and comment.
// Mounted under /api/blogs:
//   GET  /posts/:type/:id/engagement          likes, dislikes, my reaction, comment count
//   PUT  /posts/:type/:id/reaction            { reaction: "like" | "dislike" | "none" }
//   GET  /posts/:type/:id/comments            ?sort=newest|oldest|top&page= — top-level comments with their replies
//   POST /posts/:type/:id/comments            { body, parentId? } — parentId replies to a comment or a reply
//   PATCH  /comments/:id                      { body } — the author edits their comment
//   DELETE /comments/:id                      the author, the post's author, or an admin
//   PUT  /comments/:id/reaction               { reaction }
//   POST /posts/:type/:id/view                { visitorId? } — counts a read (see views.js)
//   GET  /stats/mine                          views, readers, likes, comments for the signed-in author's posts (admins: Plumber Finder's posts + site totals)

const PAGE_SIZE = 20;
const MAX_REPLIES = 200;
const REACTIONS = { like: 1, dislike: -1, none: 0 };

/** Reads the Bearer token if there is one (reading works signed out). Admins must still be active. */
async function readAccount(req) {
  const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.slice(7) : null;
  if (!token) return null;
  try {
    const payload = verifyAccessToken(token);
    if (!["user", "company", "freelancer", "admin"].includes(payload.accountType)) return null;
    if (payload.accountType === "admin" && !(await Admin.exists({ _id: payload.sub, isActive: true }))) return null;
    return payload;
  } catch {
    return null;
  }
}
const optionalAccount = async (req, _res, next) => { try { req.auth = await readAccount(req); next(); } catch (error) { next(error); } };
const requireAccount = async (req, res, next) => {
  try {
    req.auth = await readAccount(req);
    if (!req.auth) return res.status(401).json({ message: "Please log in to like or comment." });
    next();
  } catch (error) { next(error); }
};
const findPost = async (req, res, next) => {
  try {
    req.post = await resolvePost(req.params.type, req.params.id);
    if (!req.post) return res.status(404).json({ message: "Article not found." });
    next();
  } catch (error) { next(error); }
};

const actor = (auth) => ({ accountType: auth.accountType, account: new mongoose.Types.ObjectId(String(auth.sub)) });
const sameActor = (a, auth) => Boolean(auth) && a.accountType === auth.accountType && String(a.account) === String(auth.sub);
const readBody = (raw) => (typeof raw === "string" ? raw.replace(/\r\n/g, "\n").trim() : "");

/**
 * Sets one account's reaction on a post or comment and returns the previous value (1, -1, or 0). The unique
 * index makes it one reaction per account; a simultaneous first reaction from the same account is retried.
 */
async function setReaction(Model, filter, value) {
  for (let attempt = 0; ; attempt++) {
    try {
      const previous = value === 0
        ? await Model.findOneAndDelete(filter).lean()
        : await Model.findOneAndUpdate(filter, { $set: { value } }, { upsert: true, new: false, setDefaultsOnInsert: true }).lean();
      return previous?.value ?? 0;
    } catch (error) {
      if (error?.code !== 11000 || attempt >= 2) throw error;
    }
  }
}

async function postSummary(post, auth) {
  const [likes, dislikes, comments, mine, stats] = await Promise.all([
    BlogReaction.countDocuments({ post: post.key, value: 1 }),
    BlogReaction.countDocuments({ post: post.key, value: -1 }),
    BlogComment.countDocuments({ post: post.key, deleted: false }),
    auth ? BlogReaction.findOne({ post: post.key, ...actor(auth) }).select("value").lean() : null,
    statsFor([post.key]),
  ]);
  const { views, readers } = stats.get(post.key);
  return { likes, dislikes, comments, views, readers, myReaction: mine?.value === 1 ? "like" : mine?.value === -1 ? "dislike" : null };
}

/** A comment as readers see it: deleted text removed, who wrote it, and the reader's own reaction. */
function present(comment, post, auth, myReactions) {
  const author = comment.author;
  return {
    _id: comment._id, root: comment.root, parent: comment.parent, createdAt: comment.createdAt, editedAt: comment.editedAt,
    body: comment.deleted ? "" : comment.body, deleted: comment.deleted, edited: comment.edited,
    likes: comment.likes, dislikes: comment.dislikes, replyCount: comment.replyCount,
    replyTo: comment.replyTo?.name ? { comment: comment.replyTo.comment, name: comment.replyTo.name } : null,
    author: { name: comment.deleted ? "Deleted comment" : author.name, type: author.accountType, isPostAuthor: isOwner(post, author.accountType, author.account), isMe: sameActor(author, auth) },
    myReaction: myReactions.get(String(comment._id)) ?? null,
    canEdit: !comment.deleted && sameActor(author, auth),
    canDelete: !comment.deleted && Boolean(auth) && (sameActor(author, auth) || auth.accountType === "admin" || isOwner(post, auth.accountType, auth.sub)),
  };
}

/** Tells someone about a new comment or reply on their post or comment (never about their own). */
async function tell(person, notice) {
  if (person.accountType === "user") return notifyCustomer(person.account, { type: "comment", ...notice });
  if (person.accountType === "admin") return notifyAdmins({ type: "comment", ...notice });
  return notifyProvider(person.accountType, person.account, { type: "comment", ...notice });
}

export const engagementRouter = Router();

engagementRouter.get("/posts/:type/:id/engagement", optionalAccount, findPost, async (req, res, next) => {
  try { res.json({ data: await postSummary(req.post, req.auth) }); } catch (error) { next(error); }
});

engagementRouter.put("/posts/:type/:id/reaction", requireAccount, findPost, async (req, res, next) => {
  try {
    const value = REACTIONS[req.body?.reaction];
    if (value === undefined) return res.status(400).json({ message: "reaction must be like, dislike, or none." });
    await setReaction(BlogReaction, { post: req.post.key, ...actor(req.auth) }, value);
    res.json({ data: await postSummary(req.post, req.auth) });
  } catch (error) { next(error); }
});

engagementRouter.get("/posts/:type/:id/comments", optionalAccount, findPost, async (req, res, next) => {
  try {
    const sort = { newest: { createdAt: -1 }, oldest: { createdAt: 1 }, top: { score: -1, createdAt: -1 } }[req.query.sort] ?? { createdAt: -1 };
    const page = Math.max(1, Number.parseInt(req.query.page, 10) || 1);
    const filter = { post: req.post.key, root: null };
    const [roots, total] = await Promise.all([
      BlogComment.find(filter).sort(sort).skip((page - 1) * PAGE_SIZE).limit(PAGE_SIZE).lean(),
      BlogComment.countDocuments(filter),
    ]);
    const replies = roots.length ? await BlogComment.find({ post: req.post.key, root: { $in: roots.map((c) => c._id) } }).sort({ createdAt: 1 }).limit(MAX_REPLIES * roots.length).lean() : [];
    const ids = [...roots, ...replies].map((c) => c._id);
    const mine = req.auth && ids.length ? await BlogCommentReaction.find({ comment: { $in: ids }, ...actor(req.auth) }).select("comment value").lean() : [];
    const myReactions = new Map(mine.map((r) => [String(r.comment), r.value === 1 ? "like" : "dislike"]));
    const data = roots.map((root) => ({
      ...present(root, req.post, req.auth, myReactions),
      replies: replies.filter((reply) => String(reply.root) === String(root._id)).map((reply) => present(reply, req.post, req.auth, myReactions)),
    }));
    res.json({ data, page, limit: PAGE_SIZE, total });
  } catch (error) { next(error); }
});

engagementRouter.post("/posts/:type/:id/comments", requireAccount, findPost, async (req, res, next) => {
  try {
    const body = readBody(req.body?.body);
    if (!body) return res.status(400).json({ message: "Write a comment first.", errors: { body: "is required" } });
    if (body.length > 2000) return res.status(400).json({ message: "Comments can be up to 2000 characters.", errors: { body: "must be 2000 characters or fewer" } });
    const me = actor(req.auth);
    // The same comment twice in a row (a double click) is ignored.
    if (await BlogComment.exists({ post: req.post.key, "author.accountType": me.accountType, "author.account": me.account, body, createdAt: { $gt: new Date(Date.now() - 30_000) } })) {
      return res.status(409).json({ message: "You just posted that comment." });
    }
    let parent = null;
    if (req.body?.parentId) {
      parent = mongoose.isValidObjectId(req.body.parentId) ? await BlogComment.findOne({ _id: req.body.parentId, post: req.post.key }).lean() : null;
      if (!parent || parent.deleted) return res.status(404).json({ message: "The comment you replied to no longer exists." });
    }
    const name = await displayName(req.auth);
    if (!name) return res.status(401).json({ message: "Please log in again to comment." });
    const comment = await BlogComment.create({
      post: req.post.key, body, author: { ...me, name },
      root: parent ? parent.root ?? parent._id : null,
      parent: parent?._id ?? null,
      replyTo: parent ? { comment: parent._id, name: parent.author.name, accountType: parent.author.accountType, account: parent.author.account } : undefined,
    });
    if (parent) await BlogComment.updateOne({ _id: comment.root }, { $inc: { replyCount: 1 } });

    // Notify the person replied to, and the post's author (each once, never yourself).
    const link = `${req.post.link}#comment-${comment._id}`;
    const told = new Set([`${me.accountType}:${me.account}`]);
    const preview = body.length > 120 ? `${body.slice(0, 117)}…` : body;
    if (parent && !told.has(`${parent.author.accountType}:${parent.author.account}`)) {
      told.add(`${parent.author.accountType}:${parent.author.account}`);
      await tell(parent.author, { title: "New reply to your comment", message: `${name} replied on “${req.post.title}”: ${preview}`, link });
    }
    const owner = req.post.owner;
    if (owner && !(owner.accountType === "admin" ? me.accountType === "admin" : told.has(`${owner.accountType}:${owner.account}`))) {
      await tell(owner, { title: "New comment on your article", message: `${name} commented on “${req.post.title}”: ${preview}`, link });
    }
    res.status(201).json({ message: parent ? "Reply posted." : "Comment posted.", data: { ...present(comment.toObject(), req.post, req.auth, new Map()), replies: [] } });
  } catch (error) { next(error); }
});

/** Loads a comment and its post for the comment routes. */
const findComment = async (req, res, next) => {
  try {
    req.comment = mongoose.isValidObjectId(req.params.id) ? await BlogComment.findById(req.params.id) : null;
    const [type, ...rest] = req.comment?.post.split(":") ?? [];
    req.post = req.comment && await resolvePost(type, rest.join(":"));
    if (!req.comment || !req.post) return res.status(404).json({ message: "Comment not found." });
    next();
  } catch (error) { next(error); }
};

engagementRouter.patch("/comments/:id", requireAccount, findComment, async (req, res, next) => {
  try {
    const { comment } = req;
    if (!sameActor(comment.author, req.auth)) return res.status(403).json({ message: "You can only edit your own comments." });
    if (comment.deleted) return res.status(409).json({ message: "This comment was deleted." });
    const body = readBody(req.body?.body);
    if (!body) return res.status(400).json({ message: "A comment can't be empty.", errors: { body: "is required" } });
    if (body.length > 2000) return res.status(400).json({ message: "Comments can be up to 2000 characters.", errors: { body: "must be 2000 characters or fewer" } });
    if (body !== comment.body) Object.assign(comment, { body, edited: true, editedAt: new Date() });
    await comment.save();
    res.json({ message: "Comment updated.", data: present(comment.toObject(), req.post, req.auth, new Map()) });
  } catch (error) { next(error); }
});

engagementRouter.delete("/comments/:id", requireAccount, findComment, async (req, res, next) => {
  try {
    const { comment, auth } = req;
    const allowed = sameActor(comment.author, auth) || auth.accountType === "admin" || isOwner(req.post, auth.accountType, auth.sub);
    if (!allowed) return res.status(403).json({ message: "You can't delete this comment." });
    if (!comment.root && comment.replyCount > 0) {
      // Keep the thread: the comment becomes "[deleted]" and its replies stay.
      Object.assign(comment, { deleted: true, body: "" });
      await comment.save();
    } else {
      await Promise.all([comment.deleteOne(), BlogCommentReaction.deleteMany({ comment: comment._id })]);
      if (comment.root) {
        const root = await BlogComment.findOneAndUpdate({ _id: comment.root }, { $inc: { replyCount: -1 } }, { new: true });
        // A deleted comment whose last reply is gone disappears too.
        if (root?.deleted && root.replyCount <= 0) await Promise.all([root.deleteOne(), BlogCommentReaction.deleteMany({ comment: root._id })]);
      }
    }
    res.json({ message: "Comment deleted." });
  } catch (error) { next(error); }
});

engagementRouter.put("/comments/:id/reaction", requireAccount, findComment, async (req, res, next) => {
  try {
    const value = REACTIONS[req.body?.reaction];
    if (value === undefined) return res.status(400).json({ message: "reaction must be like, dislike, or none." });
    if (req.comment.deleted) return res.status(409).json({ message: "This comment was deleted." });
    const previous = await setReaction(BlogCommentReaction, { comment: req.comment._id, ...actor(req.auth) }, value);
    // Counters move by the change only, so repeated or simultaneous clicks can't double count.
    const likes = (value === 1 ? 1 : 0) - (previous === 1 ? 1 : 0);
    const dislikes = (value === -1 ? 1 : 0) - (previous === -1 ? 1 : 0);
    const updated = likes || dislikes ? await BlogComment.findByIdAndUpdate(req.comment._id, { $inc: { likes, dislikes, score: likes - dislikes } }, { new: true }).lean() : req.comment.toObject();
    res.json({ data: { likes: updated.likes, dislikes: updated.dislikes, myReaction: value === 1 ? "like" : value === -1 ? "dislike" : null } });
  } catch (error) { next(error); }
});

// Counts a read. The post's own author and search-engine bots aren't counted.
engagementRouter.post("/posts/:type/:id/view", optionalAccount, findPost, async (req, res, next) => {
  try {
    const skip = isBot(req) || (req.auth && isOwner(req.post, req.auth.accountType, req.auth.sub));
    const result = skip ? { counted: false, newReader: false } : await recordView(req.post.key, viewerOf(req, req.auth));
    // The plumber who wrote it gets a "read your blog" activity (admins see it on their record).
    const provider = req.post.provider;
    if (result.counted && provider) await recordActivity({ providerType: provider.type, providerId: provider.id, providerAccount: req.post.owner?.account ?? null, providerName: provider.name, event: "blog_read", target: { id: req.post.key, title: req.post.title }, actor: actorOf(req, req.auth) });
    const { views, readers } = (await statsFor([req.post.key])).get(req.post.key);
    res.json({ data: { views, readers, ...result } });
  } catch (error) { next(error); }
});

/** Likes, dislikes, and comments for many posts: Map(post key → counts). */
async function engagementCounts(keys) {
  const [reactions, comments] = await Promise.all([
    BlogReaction.aggregate([{ $match: { post: { $in: keys } } }, { $group: { _id: { post: "$post", value: "$value" }, count: { $sum: 1 } } }]),
    BlogComment.aggregate([{ $match: { post: { $in: keys }, deleted: false } }, { $group: { _id: "$post", count: { $sum: 1 } } }]),
  ]);
  return new Map(keys.map((key) => [key, {
    likes: reactions.find((row) => row._id.post === key && row._id.value === 1)?.count ?? 0,
    dislikes: reactions.find((row) => row._id.post === key && row._id.value === -1)?.count ?? 0,
    comments: comments.find((row) => row._id === key)?.count ?? 0,
  }]));
}

// The signed-in author's posts with their numbers, most read first, plus totals.
engagementRouter.get("/stats/mine", requireAccount, async (req, res, next) => {
  try {
    const { accountType, sub } = req.auth;
    const sources = { company: [CompanyBlog, { company: sub }], freelancer: [FreelancerBlog, { freelancer: sub }], admin: [PlatformBlog, {}] };
    if (!sources[accountType]) return res.status(403).json({ message: "Only blog authors have blog statistics." });
    const [Model, filter] = sources[accountType];
    const prefix = accountType === "admin" ? "platform" : accountType;
    const posts = await Model.find(filter).select("title slug status publishDate").lean();
    const keys = posts.map((post) => `${prefix}:${post._id}`);
    const [stats, counts] = await Promise.all([statsFor(keys), engagementCounts(keys)]);
    const data = posts.map((post, index) => ({ _id: post._id, title: post.title, slug: post.slug, status: post.status, publishDate: post.publishDate, ...stats.get(keys[index]), ...counts.get(keys[index]) }))
      .sort((a, b) => b.views - a.views);
    const totals = data.reduce((sum, row) => ({ views: sum.views + row.views, readers: sum.readers + row.readers, likes: sum.likes + row.likes, comments: sum.comments + row.comments }), { views: 0, readers: 0, likes: 0, comments: 0 });
    // Admins also see every blog on the site, by author type.
    let site;
    if (accountType === "admin") {
      const grouped = await BlogPostStats.aggregate([{ $group: { _id: { $arrayElemAt: [{ $split: ["$post", ":"] }, 0] }, views: { $sum: "$views" }, readers: { $sum: "$readers" }, posts: { $sum: 1 } } }]);
      const byType = Object.fromEntries(["platform", "company", "freelancer", "demo"].map((type) => [type, grouped.find((row) => row._id === type) ?? { views: 0, readers: 0, posts: 0 }]).map(([type, row]) => [type, { views: row.views, readers: row.readers, postsRead: row.posts }]));
      site = { views: grouped.reduce((n, row) => n + row.views, 0), readers: grouped.reduce((n, row) => n + row.readers, 0), byType };
    }
    res.json({ data, totals, ...(site ? { site } : {}) });
  } catch (error) { next(error); }
});
