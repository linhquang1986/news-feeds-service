const articles = require("../../db/models");

exports.getAuthor = (req, res, next) => {
    try {
        articles.findAll({
            group: ['author'],
            attributes: ['author']
        }).then(function (rows) {
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (e) {
        next(e);
    }
}

exports.getSource = (req, res, next) => {
    try {
        articles.findAll({
            group: ['sourceName'],
            attributes: ['sourceName']
        }).then(function (rows) {
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (e) {
        next(e);
    }
}

exports.getArticles = (req, res, next) => {
    try {
        articles.findAll({ where: { isDel: 1 } }).then(function (rows) {
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (e) {
        next(e);
    }
}
exports.getArticleById = (req, res, next) => {
    try {
        let params = [req.params.id]
        articles.findAll({ where: { id: params, isDel: 1 } }).then(function (rows) {
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (e) {
        next(e);
    }
}

exports.deleteAll = (req, res, next) => {
    try {
        articles.update(
            { isDel: 0 }, {where:{isDel:1}}
        ).then(result => {
            res.json({ "message": "deleted all" })
        })
    } catch (e) {
        next(e);
    }
}

exports.deleteByID = (req, res, next) => {
    try {
        let delID = req.params.id || 0
        articles.update(
            { isDel: 0 },
            { where: { id: delID } }).then(result => {
                res.json({ "message": "deleted" })
            })
    } catch (e) {
        next(e);
    }
}
exports.getNewByAuthorAndSource = (req, res, next) => {
    try {
        let conditionGroup = {};
        /**
         * Should divide multiple cases so that it is easy to write unit test in the future.
         */
        if (req.body.author && req.body.sourceName) {
            conditionGroup = {
                author: req.body.author,
                sourceName: req.body.sourceName
            }
        } else if (req.body.author && !req.body.sourceName) {
            conditionGroup = {
                author: req.body.author,
                sourceName: req.body.sourceName
            }
        } else {
            conditionGroup = {
                sourceName: req.body.sourceName
            }
        }
        articles.findAll({ where: conditionGroup }).then(function (rows) {
            res.json({
                "message": "success",
                "data": rows
            })
        });
    } catch (e) {
        next(e);
    }
}