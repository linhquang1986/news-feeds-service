const express = require('express');
const ctrl = require('../ctrls/pizza.ctrl');
const router = express.Router();

// un protected route
// Get list author
router.get("/getAuthor", ctrl.getAuthor);

// Get list name of source
router.get("/getSource", ctrl.getSource);

// get news by author and source
router.get("/getNewByAuthorAndSource", ctrl.getNewByAuthorAndSource);

// Get all data of articles table
router.get("/articles", ctrl.getArticles);

router.get("/articles/:id", ctrl.getArticleById);

// Read data from Pizza API and insert all into sqlite
router.post("/articles/", ctrl.postArticles);

// Delete all data
router.delete("/articles/", ctrl.deleteAll);

// Set isDel = 0 when delete by id
router.delete("/article/:id", ctrl.deleteByID);

module.exports = router;