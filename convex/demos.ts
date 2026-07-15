import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Queries
export const get = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db
      .query("demos")
      .filter((q: any) => q.eq(q.field("published"), true))
      .collect();
  },
});

export const list = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db.query("demos").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.db
      .query("demos")
      .withIndex("by_slug", (q: any) => q.eq("slug", args.slug))
      .filter((q: any) => q.eq(q.field("published"), true))
      .unique();
  },
});

export const listFeatured = query({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.db
      .query("demos")
      .filter((q: any) =>
        q.and(
          q.eq(q.field("published"), true),
          q.eq(q.field("is_featured"), true)
        )
      )
      .collect();
  },
});

// 2. Mutations
export const create = mutation({
  args: {
    type: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    slug: v.string(),
    category: v.optional(v.string()),
    sub_program: v.optional(v.string()),
    subject: v.optional(v.string()),
    semester: v.optional(v.string()),
    university: v.optional(v.string()),
    assignment_type: v.optional(v.string()),
    price_handwritten: v.optional(v.number()),
    price_pdf: v.optional(v.number()),
    show_price_public: v.boolean(),
    video_reel_url: v.optional(v.string()),
    pdf_preview_images: v.optional(v.array(v.string())),
    handwritten_preview_images: v.optional(v.array(v.string())),
    tech_stack: v.optional(v.array(v.string())),
    live_url: v.optional(v.string()),
    youtube_url: v.optional(v.string()),
    thumbnail_url: v.optional(v.string()),
    file_urls: v.optional(v.array(v.string())),
    is_featured: v.boolean(),
    sort_order: v.number(),
    published: v.boolean(),
    video_reels: v.optional(v.array(v.string())),
    handwritten_docs: v.optional(
      v.array(
        v.object({
          title: v.string(),
          pages: v.array(v.string()),
        })
      )
    ),
    pdf_docs: v.optional(
      v.array(
        v.object({
          title: v.string(),
          pages: v.array(v.string()),
        })
      )
    ),
  },
  handler: async (ctx: any, args: any) => {
    return await ctx.db.insert("demos", {
      ...args,
      click_count_view_pdf: 0,
      click_count_order: 0,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("demos"),
    type: v.optional(v.string()),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    slug: v.optional(v.string()),
    category: v.optional(v.string()),
    sub_program: v.optional(v.string()),
    subject: v.optional(v.string()),
    semester: v.optional(v.string()),
    university: v.optional(v.string()),
    assignment_type: v.optional(v.string()),
    price_handwritten: v.optional(v.number()),
    price_pdf: v.optional(v.number()),
    show_price_public: v.optional(v.boolean()),
    video_reel_url: v.optional(v.string()),
    pdf_preview_images: v.optional(v.array(v.string())),
    handwritten_preview_images: v.optional(v.array(v.string())),
    tech_stack: v.optional(v.array(v.string())),
    live_url: v.optional(v.string()),
    youtube_url: v.optional(v.string()),
    thumbnail_url: v.optional(v.string()),
    file_urls: v.optional(v.array(v.string())),
    is_featured: v.optional(v.boolean()),
    sort_order: v.optional(v.number()),
    published: v.optional(v.boolean()),
    video_reels: v.optional(v.array(v.string())),
    handwritten_docs: v.optional(
      v.array(
        v.object({
          title: v.string(),
          pages: v.array(v.string()),
        })
      )
    ),
    pdf_docs: v.optional(
      v.array(
        v.object({
          title: v.string(),
          pages: v.array(v.string()),
        })
      )
    ),
  },
  handler: async (ctx: any, args: any) => {
    const { id, ...fields } = args;
    await ctx.db.patch(id, fields);
  },
});

export const remove = mutation({
  args: { id: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    await ctx.db.delete(args.id);
  },
});

export const incrementViewPdf = mutation({
  args: { id: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    const demo = await ctx.db.get(args.id);
    if (demo) {
      await ctx.db.patch(args.id, {
        click_count_view_pdf: (demo.click_count_view_pdf || 0) + 1,
      });
    }
  },
});

export const incrementOrder = mutation({
  args: { id: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    const demo = await ctx.db.get(args.id);
    if (demo) {
      await ctx.db.patch(args.id, {
        click_count_order: (demo.click_count_order || 0) + 1,
      });
    }
  },
});

export const updateOrder = mutation({
  args: {
    orders: v.array(
      v.object({
        id: v.id("demos"),
        sort_order: v.number(),
      })
    ),
  },
  handler: async (ctx: any, args: any) => {
    for (const item of args.orders) {
      await ctx.db.patch(item.id, { sort_order: item.sort_order });
    }
  },
});

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx: any) => {
    return await ctx.storage.generateUploadUrl();
  },
});

export const getUrl = query({
  args: { storageId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const getStorageUrl = mutation({
  args: { storageId: v.string() },
  handler: async (ctx: any, args: any) => {
    return await ctx.storage.getUrl(args.storageId);
  },
});

export const incrementLikes = mutation({
  args: { id: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    const demo = await ctx.db.get(args.id);
    if (demo) {
      await ctx.db.patch(args.id, { likes_count: (demo.likes_count || 0) + 1 });
    }
  },
});

export const decrementLikes = mutation({
  args: { id: v.id("demos") },
  handler: async (ctx: any, args: any) => {
    const demo = await ctx.db.get(args.id);
    if (demo) {
      const current = demo.likes_count || 0;
      await ctx.db.patch(args.id, { likes_count: Math.max(0, current - 1) });
    }
  },
});
