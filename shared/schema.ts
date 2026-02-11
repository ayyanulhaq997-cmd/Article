import { pgTable, text, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const articles = pgTable("articles", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  excerpt: text("excerpt"),
  introText: text("intro_text"),
  content: text("content"),
  category: text("category"),
  date: text("date"),
  readTime: text("read_time"),
  image: text("image"),
  price: numeric("price"),
  isPLR: boolean("is_plr").default(true),
});

export const insertArticleSchema = createInsertSchema(articles);
export type InsertArticle = z.infer<typeof insertArticleSchema>;
export type Article = typeof articles.$inferSelect;
