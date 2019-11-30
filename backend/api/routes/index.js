const express = require('express');
const fetch = require('node-fetch');
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
        // data.map(item => {
        //     let sql = 'INSERT OR REPLACE INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName, isDel) VALUES (?,?,?,?,?,?,?,?,?, 1)'
        //     let params = [item.author, item.title, item.description, item.url, item.urlToImage, item.publishedAt, item.content, item.source.id, item.source.name]
        //     this.db.run(sql, params, function (err, result) {
        //         if (err) {
        //             res.status(400).json({ "error": err.message })
        //             return;
        //         }
        //     });
        // })
        res.json({
            "message": "init data successfully"
        })
    })
});

router.use('/pizza', pizzaRoutes);

module.exports = router;