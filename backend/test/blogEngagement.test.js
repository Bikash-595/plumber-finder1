// Blog FAQs, Plumber Finder's own blog, and reader engagement: likes/dislikes, comments, replies
// (also to replies), edits, deletes, and likes/dislikes on comments.
import { after, before, beforeEach, describe, test } from "node:test";
import assert from "node:assert/strict";
import { startTestServer } from "./helpers/testServer.js";

const { Admin } = await import("../src/auth/admin/models/Admin.js");
const { resetAdminLoginRateLimit } = await import("../src/auth/admin/middleware/adminLoginRateLimit.js");

let api, stop;
before(async () => ({ api, stop } = await startTestServer()));
after(() => stop());
beforeEach(() => resetAdminLoginRateLimit());

let seq = 0;
const signup = async (type, body) => (await api("POST", `/api/auth/${type}/signup`, { body: { password: "password123", zipCode: "78701", ...body } })).body;
const newCustomer = async (name = "Reader") => { const n = ++seq; return { ...(await signup("users", { name: `${name} ${n}`, email: `reader${n}@example.com` })), name: `${name} ${n}` }; };
async function newAdmin() {
  const email = `blogadmin${++seq}@example.com`;
  await Admin.create({ name: "Ada Admin", email, password: "admin-password-1" });
  return (await api("POST", "/api/auth/admins/login", { body: { email, password: "admin-password-1" } })).body.token;
}
async function companyWithPost(body = {}) {
  const n = ++seq;
  const { token } = await signup("companies", { companyName: `Blog Co ${n}`, email: `blogco${n}@example.com` });
  await api("POST", "/api/companies/onboarding", { token, body: { formData: { companyName: `Blog Co ${n}` } } });
  const post = (await api("POST", "/api/companies/blogs", { token, body: { title: `Fixing leaks ${n}`, excerpt: "How to fix leaks.", content: "Turn off the water first.", status: "published", ...body } })).body.data;
  return { token, post, name: `Blog Co ${n}` };
}
// Reaction and comment counts (views are tested on their own below).
const engagement = async (path, token) => { const { views: _views, readers: _readers, ...rest } = (await api("GET", `/api/blogs/posts/${path}/engagement`, { token })).body.data; return rest; };
const comments = async (path, token, query = "") => (await api("GET", `/api/blogs/posts/${path}/comments${query}`, { token })).body;

describe("blog FAQs", () => {
  test("company and freelancer posts carry FAQs to the public profile", async () => {
    const faqs = [{ question: "How long does it take?", answer: "About an hour." }, { question: "Is it safe?", answer: "Yes, with the water off." }];
    assert.equal((await api("POST", "/api/companies/blogs", { token: (await companyWithPost()).token, body: { title: "x", excerpt: "x", content: "x", faqs: [{ question: "No answer" }] } })).status, 400);
    const { post } = await companyWithPost({ faqs });
    assert.deepEqual(post.faqs, faqs);
    const listings = (await api("GET", "/api/companies/public")).body.data;
    const listing = listings.find((item) => item.companyName === `Blog Co ${seq}`);
    const profile = (await api("GET", `/api/companies/public/${listing._id}/profile`)).body.data;
    assert.deepEqual(profile.blogs[0].faqs, faqs);
  });
});

describe("Plumber Finder's own blog", () => {
  test("admins write posts with FAQs; published ones are public and in the feed", async () => {
    const admin = await newAdmin();
    const customer = await newCustomer();
    assert.equal((await api("POST", "/api/admin/blogs", { token: customer.token, body: { title: "x", excerpt: "x", content: "x" } })).status, 403);
    const draft = (await api("POST", "/api/admin/blogs", { token: admin, body: { title: "Winter Plumbing Checklist", excerpt: "Get ready for winter.", content: "Insulate pipes.", faqs: [{ question: "When to start?", answer: "In autumn." }] } })).body.data;
    assert.equal(draft.slug, "winter-plumbing-checklist");
    assert.equal((await api("GET", "/api/blogs/platform/winter-plumbing-checklist")).status, 404, "drafts are private");
    const published = (await api("PUT", `/api/admin/blogs/${draft._id}`, { token: admin, body: { status: "published" } })).body.data;
    assert.ok(published.publishDate);
    const post = (await api("GET", "/api/blogs/platform/winter-plumbing-checklist")).body.data;
    assert.deepEqual([post.title, post.provider.name, post.faqs[0].answer], ["Winter Plumbing Checklist", "Plumber Finder", "In autumn."]);
    const feed = (await api("GET", "/api/blogs")).body.data;
    assert.ok(feed.some((item) => item.provider.type === "platform" && item.slug === "winter-plumbing-checklist"));
    const second = (await api("POST", "/api/admin/blogs", { token: admin, body: { title: "Winter Plumbing Checklist", excerpt: "x", content: "x" } })).body.data;
    assert.equal(second.slug, "winter-plumbing-checklist-2");
    assert.equal((await api("DELETE", `/api/admin/blogs/${second._id}`, { token: admin })).status, 200);
  });
});

describe("likes and dislikes on posts", () => {
  test("one reaction per account; switching and removing update the counts", async () => {
    const { post } = await companyWithPost();
    const path = `company/${post._id}`;
    const [a, b] = [await newCustomer(), await newCustomer()];
    assert.deepEqual(await engagement(path), { likes: 0, dislikes: 0, comments: 0, myReaction: null }, "anyone can read the counts");
    assert.equal((await api("PUT", `/api/blogs/posts/${path}/reaction`, { body: { reaction: "like" } })).status, 401, "reacting needs an account");
    await Promise.all([1, 2, 3].map(() => api("PUT", `/api/blogs/posts/${path}/reaction`, { token: a.token, body: { reaction: "like" } })));
    assert.deepEqual(await engagement(path, a.token), { likes: 1, dislikes: 0, comments: 0, myReaction: "like" }, "liking three times at once still counts once");
    await api("PUT", `/api/blogs/posts/${path}/reaction`, { token: b.token, body: { reaction: "dislike" } });
    await api("PUT", `/api/blogs/posts/${path}/reaction`, { token: a.token, body: { reaction: "dislike" } });
    assert.deepEqual(await engagement(path, a.token), { likes: 0, dislikes: 2, comments: 0, myReaction: "dislike" });
    await api("PUT", `/api/blogs/posts/${path}/reaction`, { token: a.token, body: { reaction: "none" } });
    assert.deepEqual(await engagement(path, a.token), { likes: 0, dislikes: 1, comments: 0, myReaction: null });
    assert.equal((await api("PUT", `/api/blogs/posts/${path}/reaction`, { token: a.token, body: { reaction: "love" } })).status, 400);
  });

  test("draft posts and unknown posts can't be reacted to; sample posts can", async () => {
    const { post } = await companyWithPost({ status: "draft" });
    const reader = await newCustomer();
    assert.equal((await api("PUT", `/api/blogs/posts/company/${post._id}/reaction`, { token: reader.token, body: { reaction: "like" } })).status, 404);
    assert.equal((await api("GET", "/api/blogs/posts/company/not-an-id/engagement")).status, 404);
    assert.equal((await api("PUT", "/api/blogs/posts/demo/1--emergency-plumbing-tips/reaction", { token: reader.token, body: { reaction: "like" } })).body.data.likes, 1);
  });
});

describe("comments and replies", () => {
  test("comment, reply, reply to a reply, edit, and notifications", async () => {
    const owner = await companyWithPost();
    const path = `company/${owner.post._id}`;
    const [ana, ben] = [await newCustomer("Ana"), await newCustomer("Ben")];

    assert.equal((await api("POST", `/api/blogs/posts/${path}/comments`, { body: { body: "Hi" } })).status, 401);
    assert.equal((await api("POST", `/api/blogs/posts/${path}/comments`, { token: ana.token, body: { body: "   " } })).status, 400);
    const top = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: ana.token, body: { body: "Great tips! Does this work for copper pipes?" } })).body.data;
    assert.equal((await api("POST", `/api/blogs/posts/${path}/comments`, { token: ana.token, body: { body: "Great tips! Does this work for copper pipes?" } })).status, 409, "a double click doesn't post twice");
    const answer = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: owner.token, body: { body: "Yes, it does.", parentId: top._id } })).body.data;
    assert.equal(answer.author.isPostAuthor, true);
    const followUp = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: ben.token, body: { body: "And for PEX?", parentId: answer._id } })).body.data;
    assert.deepEqual([followUp.root, followUp.parent, followUp.replyTo.name], [top._id, answer._id, owner.name], "a reply to a reply stays in the thread and names who it answers");

    // Editing: only the author.
    assert.equal((await api("PATCH", `/api/blogs/comments/${top._id}`, { token: ben.token, body: { body: "hacked" } })).status, 403);
    const edited = (await api("PATCH", `/api/blogs/comments/${top._id}`, { token: ana.token, body: { body: "Great tips! Does this work for copper and PEX pipes?" } })).body.data;
    assert.deepEqual([edited.edited, edited.body.includes("PEX")], [true, true]);

    const list = await comments(path, ana.token);
    assert.equal(list.total, 1);
    assert.deepEqual(list.data[0].replies.map((r) => [r.author.name, r.replyTo.name]), [[owner.name, ana.name], [ben.name, owner.name]]);
    assert.deepEqual([list.data[0].replyCount, list.data[0].canEdit, list.data[0].replies[0].canEdit], [2, true, false]);
    assert.equal((await engagement(path)).comments, 3);

    // Notifications: the post's author about new comments; each person replied to about replies.
    const companyNotes = (await api("GET", "/api/companies/notifications", { token: owner.token })).body.data.map((n) => n.title);
    assert.ok(companyNotes.includes("New comment on your article") && companyNotes.includes("New reply to your comment"));
    const anaNotes = (await api("GET", "/api/users/notifications", { token: ana.token })).body.data;
    assert.ok(anaNotes.some((n) => n.title === "New reply to your comment" && n.link.endsWith(`#comment-${answer._id}`)));
    const benNotes = (await api("GET", "/api/users/notifications", { token: ben.token })).body.data;
    assert.equal(benNotes.filter((n) => n.title.startsWith("New")).length, 0, "nobody is told about their own comment");
  });

  test("likes and dislikes on comments stay accurate", async () => {
    const owner = await companyWithPost();
    const path = `company/${owner.post._id}`;
    const readers = [await newCustomer(), await newCustomer(), await newCustomer()];
    const comment = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: readers[0].token, body: { body: "Helpful!" } })).body.data;
    const react = (token, reaction) => api("PUT", `/api/blogs/comments/${comment._id}/reaction`, { token, body: { reaction } });
    await Promise.all([react(readers[0].token, "like"), react(readers[0].token, "like"), react(readers[1].token, "like"), react(readers[2].token, "dislike")]);
    let res = (await react(readers[2].token, "like")).body.data;
    assert.deepEqual([res.likes, res.dislikes, res.myReaction], [3, 0, "like"]);
    res = (await react(readers[1].token, "none")).body.data;
    assert.deepEqual([res.likes, res.dislikes], [2, 0]);
    const top = (await comments(path, readers[0].token, "?sort=top")).data[0];
    assert.deepEqual([top.likes, top.myReaction], [2, "like"]);
  });

  test("deleting keeps a thread that has replies; the post's author and admins can moderate", async () => {
    const owner = await companyWithPost();
    const path = `company/${owner.post._id}`;
    const [ana, ben, eve] = [await newCustomer(), await newCustomer(), await newCustomer()];
    const top = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: ana.token, body: { body: "Question?" } })).body.data;
    const reply = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: ben.token, body: { body: "Answer.", parentId: top._id } })).body.data;
    assert.equal((await api("DELETE", `/api/blogs/comments/${top._id}`, { token: eve.token })).status, 403);
    assert.equal((await api("DELETE", `/api/blogs/comments/${top._id}`, { token: ana.token })).status, 200);
    let thread = (await comments(path)).data[0];
    assert.deepEqual([thread.deleted, thread.body, thread.replies.length], [true, "", 1], "the reply survives under a [deleted] comment");
    assert.equal((await api("POST", `/api/blogs/posts/${path}/comments`, { token: eve.token, body: { body: "x", parentId: top._id } })).status, 404, "no replies to a deleted comment");
    // The post's author removes the last reply: the deleted comment goes too.
    assert.equal((await api("DELETE", `/api/blogs/comments/${reply._id}`, { token: owner.token })).status, 200);
    thread = await comments(path);
    assert.equal(thread.total, 0);

    const spam = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: eve.token, body: { body: "Buy now!" } })).body.data;
    const admin = await newAdmin();
    assert.equal((await api("DELETE", `/api/blogs/comments/${spam._id}`, { token: admin })).status, 200);
  });

  test("on Plumber Finder's posts, admins reply as Plumber Finder and are notified of comments", async () => {
    const admin = await newAdmin();
    const post = (await api("POST", "/api/admin/blogs", { token: admin, body: { title: `Spring Tips ${++seq}`, excerpt: "x", content: "x", status: "published" } })).body.data;
    const path = `platform/${post._id}`;
    const reader = await newCustomer();
    const comment = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: reader.token, body: { body: "Thanks!" } })).body.data;
    const reply = (await api("POST", `/api/blogs/posts/${path}/comments`, { token: admin, body: { body: "You're welcome.", parentId: comment._id } })).body.data;
    assert.deepEqual([reply.author.name, reply.author.isPostAuthor], ["Plumber Finder", true]);
    const adminNotes = (await api("GET", "/api/admin/notifications", { token: admin })).body.data;
    assert.ok(adminNotes.some((n) => n.title === "New comment on your article" && n.link.startsWith(`/blogs/${post.slug}#comment-`)));
  });
});

describe("views and readers", () => {
  const view = (path, { token, visitorId, userAgent } = {}) => api("POST", `/api/blogs/posts/${path}/view`, { token, body: visitorId ? { visitorId } : {}, headers: userAgent ? { "User-Agent": userAgent } : undefined });

  test("views count reads; readers count different people; refreshes, the author, and bots don't count", async () => {
    const owner = await companyWithPost();
    const path = `company/${owner.post._id}`;
    const [ana, ben] = [await newCustomer(), await newCustomer()];
    let res = (await view(path, { token: ana.token })).body.data;
    assert.deepEqual([res.views, res.readers, res.counted, res.newReader], [1, 1, true, true]);
    await Promise.all([1, 2, 3].map(() => view(path, { token: ana.token })));
    assert.deepEqual([(await view(path, { token: ana.token })).body.data.views], [1], "re-opening within 30 minutes is the same view");
    await view(path, { token: ben.token });
    await view(path, { visitorId: "guest-browser-0001" });
    await view(path, { visitorId: "guest-browser-0001" });
    await view(path, { visitorId: "guest-browser-0002" });
    await view(path, { token: owner.token });
    await view(path, { visitorId: "guest-browser-0003", userAgent: "Googlebot/2.1" });
    res = (await api("GET", `/api/blogs/posts/${path}/engagement`)).body.data;
    assert.deepEqual([res.views, res.readers], [4, 4], "Ana, Ben, and two guest browsers; not the author or the bot");

    // A reader coming back later counts as another view, not another reader.
    const { BlogView } = await import("../src/blogs/engagement/views.js");
    await BlogView.updateMany({ post: `company:${owner.post._id}` }, { $set: { lastViewedAt: new Date(Date.now() - 31 * 60 * 1000) } });
    res = (await view(path, { token: ana.token })).body.data;
    assert.deepEqual([res.views, res.readers, res.newReader], [5, 4, false]);
  });

  test("authors see their posts' numbers; the feed and profile show views", async () => {
    const owner = await companyWithPost();
    const path = `company/${owner.post._id}`;
    const reader = await newCustomer();
    await view(path, { token: reader.token });
    await api("PUT", `/api/blogs/posts/${path}/reaction`, { token: reader.token, body: { reaction: "like" } });
    await api("POST", `/api/blogs/posts/${path}/comments`, { token: reader.token, body: { body: "Nice" } });
    const mine = (await api("GET", "/api/blogs/stats/mine", { token: owner.token })).body;
    assert.deepEqual([mine.data[0].views, mine.data[0].readers, mine.data[0].likes, mine.data[0].comments], [1, 1, 1, 1]);
    assert.deepEqual(mine.totals, { views: 1, readers: 1, likes: 1, comments: 1 });
    assert.equal((await api("GET", "/api/blogs/stats/mine", { token: reader.token })).status, 403, "customers have no blog statistics");
    const feedItem = (await api("GET", "/api/blogs")).body.data.find((item) => item.id === String(owner.post._id));
    assert.equal(feedItem.views, 1);
    const listing = (await api("GET", "/api/companies/public")).body.data.find((item) => item.companyName === owner.name);
    assert.equal((await api("GET", `/api/companies/public/${listing._id}/profile`)).body.data.blogs[0].views, 1);
  });

  test("admins see Plumber Finder's posts and every blog on the site", async () => {
    const admin = await newAdmin();
    const post = (await api("POST", "/api/admin/blogs", { token: admin, body: { title: `Read Me ${++seq}`, excerpt: "x", content: "x", status: "published" } })).body.data;
    await view(`platform/${post._id}`, { visitorId: "guest-browser-0009" });
    const { body } = await api("GET", "/api/blogs/stats/mine", { token: admin });
    assert.equal(body.data.find((row) => row.title === post.title).views, 1);
    assert.ok(body.site.views >= body.site.byType.company.views && body.site.byType.platform.views >= 1);
  });
});
