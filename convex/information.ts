import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db
      .query("information")
      .filter((q: any) => q.eq(q.field("published"), true))
      .order("desc")
      .collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("information").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
    category: v.string(),
    is_important: v.boolean(),
    published: v.boolean(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("information", args);
  },
});

export const update = mutation({
  args: {
    id: v.id("information"),
    title: v.optional(v.string()),
    content: v.optional(v.string()),
    category: v.optional(v.string()),
    is_important: v.optional(v.boolean()),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("information") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});
