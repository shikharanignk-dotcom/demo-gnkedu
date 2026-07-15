import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// Get all comments for a specific demo
export const getByDemo = query({
  args: { demoId: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("comments")
      .filter((q: any) => q.eq(q.field("demo_id"), args.demoId))
      .order("desc")
      .collect();
  },
});

// Get all comments (for admin panel)
export const getAll = query({
  handler: async (ctx: any) => {
    return await ctx.db.query("comments").order("desc").collect();
  },
});

// Add a new comment
export const add = mutation({
  args: {
    demo_id: v.id("demos"),
    name: v.string(),
    text: v.string(),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("comments", {
      demo_id: args.demo_id,
      name: args.name,
      text: args.text,
      published: true,
    });
  },
});

// Delete a comment (admin)
export const remove = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

// Toggle publish status (admin)
export const togglePublish = mutation({
  args: { id: v.id("comments") },
  handler: async (ctx: any, args: any) => {
    const comment = await ctx.db.get(args.id);
    if (comment) {
      await ctx.db.patch(args.id, { published: !comment.published });
    }
  },
});
