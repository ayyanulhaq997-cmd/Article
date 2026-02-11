import express, { type Request, Response } from "express";
import { storage } from "./storage";
import { insertArticleSchema } from "@shared/schema";

const app = express();
app.use(express.json());

app.get("/api/articles", async (_req, res) => {
  const articles = await storage.getArticles();
  res.json(articles);
});

app.post("/api/articles", async (req, res) => {
  const parsed = insertArticleSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  const article = await storage.createArticle(parsed.data);
  res.json(article);
});

app.delete("/api/articles/:id", async (req, res) => {
  await storage.deleteArticle(req.params.id);
  res.sendStatus(204);
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Backend API running on http://localhost:${PORT}`);
});
