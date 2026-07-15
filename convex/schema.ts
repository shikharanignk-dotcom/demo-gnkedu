import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  demos: defineTable({
    type: v.string(), // "assignment" | "project" | "video"
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
    click_count_view_pdf: v.number(),
    click_count_order: v.number(),
    likes_count: v.optional(v.number()),
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
  }).index("by_slug", ["slug"]),

  reviews: defineTable({
    student_name: v.string(),
    rating: v.number(),
    review_text: v.string(),
    university: v.optional(v.string()),
    verified: v.boolean(),
    published: v.boolean(),
  }),

  information: defineTable({
    title: v.string(),
    content: v.string(),
    category: v.string(), // "Notice" | "FAQ" | "Instruction"
    is_important: v.boolean(),
    published: v.boolean(),
  }),

  comments: defineTable({
    demo_id: v.id("demos"),
    name: v.string(),
    text: v.string(),
    published: v.boolean(),
  }),

  site_settings: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("by_key", ["key"]),
});
