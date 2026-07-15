import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const get = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("site_settings").collect();
  },
});

export const getByKey = query({
  args: { key: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("site_settings")
      .withIndex("by_key", (q: any) => q.eq("key", args.key))
      .unique();
  },
});

export const upsert = mutation({
  args: {
    key: v.string(),
    value: v.any(),
  },
  handler: async (ctx: any, args: any) => {
    const existing = await ctx.db
      .query("site_settings")
      .withIndex("by_key", (q: any) => q.eq("key", args.key))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { value: args.value });
    } else {
      await ctx.db.insert("site_settings", {
        key: args.key,
        value: args.value,
      });
    }
  },
});
