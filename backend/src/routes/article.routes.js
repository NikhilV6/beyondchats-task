const express = require("express");
const router = express.Router();

const {
  createArticle,
  getAllArticles,
  getArticleById,
  updateArticle,
  deleteArticle
} = require("../controllers/article.controller");


router.get("/", getAllArticles);
router.post("/", createArticle);
router.get("/:id", getArticleById);
router.put("/:id", updateArticle);
router.delete("/:id", deleteArticle);

module.exports = router;
