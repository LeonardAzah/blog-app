const express = require("express");
const router = express.Router();
const articleController = require("../../controller/articleController");

router.post("/", articleController.createNewArticle);
router.patch("/:id", articleController.updateArticle);
router.delete("/:id", articleController.deleteArticle);
module.exports = router;
