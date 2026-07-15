import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx: any, args: any) => {
    let reviewsQuery = ctx.db
      .query("reviews")
      .filter((q: any) => q.eq(q.field("published"), true))
      .order("desc");
    
    if (args.limit) {
      return await reviewsQuery.take(args.limit);
    }
    return await reviewsQuery.collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("reviews").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    student_name: v.string(),
    rating: v.number(),
    review_text: v.string(),
    university: v.optional(v.string()),
    verified: v.boolean(),
    published: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("reviews", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("reviews"),
    student_name: v.optional(v.string()),
    rating: v.optional(v.number()),
    review_text: v.optional(v.string()),
    university: v.optional(v.string()),
    verified: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("reviews") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
