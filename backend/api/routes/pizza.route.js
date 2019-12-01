const express = require('express');

const ctrl = require('../controllers/pizza.ctrl');
const router = express.Router();

// un protected route
// Get list author
router.get("/getAuthor", ctrl.getAuthor);

// Get list name of source
router.get("/getSource", ctrl.getSource);

// get news by author and source
router.post("/getNewByAuthorAndSource", ctrl.getNewByAuthorAndSource);

// Get all data of articles table
router.get("/articles", ctrl.getArticles);

router.get("/articles/:id", ctrl.getArticleById);

// Delete all data
router.delete("/articles/", ctrl.deleteAll);

// Set isDel = 0 when delete by id
router.delete("/articles/:id", ctrl.deleteByID);

module.exports = router;