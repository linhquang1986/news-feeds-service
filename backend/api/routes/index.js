const express = require('express');
const fetch = require('node-fetch');
const db = require("../../database.js");
// import all the routes here
const pizzaRoutes = require('./pizza.route');

const router = express.Router();

// Get data from pizza
const IfoundData = (newSource) => {
    return fetch(newSource, {
        method: 'GET',
        mode: "no-cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" }
    }).then(res => {
        return res.json();
    }).then(res => {
        return res.articles;
    }).catch(res => {
        console.log("Exception : ", res);
    })
}
/**
 * GET /status
 * Root path
 */

router.get("/", (req, res, next) => {
    // init data
    let newSource = "http://www.mocky.io/v2/5dc01bc8310000b288be3e37";
    let pizzaSource = async () => {
        let data = await IfoundData(newSource);
        return data;
    }
    pizzaSource().then(data => {
        data.map(item => {
            let sql = 'INSERT OR REPLACE INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName, isDel) VALUES (?,?,?,?,?,?,?,?,?, 1)'
            let params = [item.author, item.title, item.description, item.url, item.urlToImage, item.publishedAt, item.content, item.source.id, item.source.name]
            db.run(sql, params, function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
            });
        })
        res.json({
            "message": "init data successfully"
        })
    })
});

// Read data from Pizza API and insert all into sqlite
router.post("/pizza/articles/", (req, res, next) => {
    try {
        let newSource = "http://www.mocky.io/v2/5dc01bc8310000b288be3e37";
        if (req.body.newSource) {
            newSource = req.body.newSource;
        }
        let pizzaSource = async () => {
            let data = await IfoundData(newSource);
            return data;
        }
        pizzaSource().then(data => {
            data.map(item => {
                let sql = 'INSERT OR REPLACE INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName, isDel) VALUES (?,?,?,?,?,?,?,?,?, 1)'
                let params = [item.author, item.title, item.description, item.url, item.urlToImage, item.publishedAt, item.content, item.source.id, item.source.name]
                db.run(sql, params, function (err, result) {
                    if (err) {
                        res.status(400).json({ "error": err.message })
                        return;
                    }
                });
            })
            res.json({
                "message": "success"
            })
        })
    } catch (e) {
        next(e);
    }
});

router.use('/pizza', pizzaRoutes);

module.exports = router;