const express = require("express")
const app = express()
const db = require("./database.js")
const fetch = require('node-fetch')
const cors = require('cors');

const bodyParser = require("body-parser");
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

// Get data from pizza
IfoundData = (newSource) => {
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

// get list author and name of source
app.get("/api/getAuthorAndSource", (req, res, next) => {
    var sql = "SELECT author, sourceName FROM articles GROUP BY author, sourceName";
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

// get news by author and source
app.get("/api/getNewByAuthorAndSource", (req, res, next) => {
    const sql = '';
    if (req.body.newSource && req.body.sourceName) {
        sql = `SELECT * FROM articles WHERE author = ${req.body.author} AND sourceName = ${req.body.sourceName}`;
    } else if (req.body.newSource && !req.body.sourceName) {
        sql = `SELECT * FROM articles WHERE author = ${req.body.author}`;
    } else {
        sql = `SELECT * FROM articles WHERE sourceName = ${req.body.sourceName}`;
    }
    const params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});
// Get all data of articles table
app.get("/api/articles", (req, res, next) => {
    var sql = "select * from articles"
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": rows
        })
    });
});

app.get("/api/articles/:id", (req, res, next) => {
    var sql = "select * from article where id = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ "error": err.message });
            return;
        }
        res.json({
            "message": "success",
            "data": row
        })
    });
});

// Read data from Pizza API and insert all into sqlite
app.post("/api/articles/", (req, res, next) => {
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
            var sql = 'INSERT OR IGNORE INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName, isDel) VALUES (?,?,?,?,?,?,?,?,?, 1)'
            var params = [item.author, item.title, item.description, item.url, item.urlToImage, item.publishedAt, item.content, item.source.id, item.source.name]
            db.run(sql, params, function (err, result) {
                if (err) {
                    res.status(400).json({ "error": err.message })
                    return;
                }
            });
        })
        res.json({
            "message": "success",
            "id": this.lastID
        })
    })
})

app.patch("/api/articles/:id", (req, res, next) => {
    var data = {
        name: req.body.name,
        email: req.body.email
    }
    db.run(
        `UPDATE article set 
           name = coalesce(?,name), 
           email = COALESCE(?,email), 
           password = coalesce(?,password) 
           WHERE id = ?`,
        [data.name, data.email, data.password, req.params.id],
        (err, result) => {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({
                message: "success",
                data: data
            })
        });
})

// Delete all data
app.delete("/api/articles/", (req, res, next) => {
    var sql = 'DELETE FROM articles'
    var params = []
    db.run(sql, params, (err, rs) => {
        if (err) {
            res.status(400).json({ "error": res.message })
            return;
        }
        res.json({ "message": "deleted all"})
    });
})

// Set isDel = 0 when delete by id
app.delete("/api/article/:id", (req, res, next) => {
    var sql = 'UPDATE articles set isDel=0 WHERE id = ?'
    var delID =  req.params.id || 0
    db.run(sql, delID,
        function (err, result) {
            if (err) {
                res.status(400).json({ "error": res.message })
                return;
            }
            res.json({ "message": "deleted", rows: this.changes })
        });
})

// Root path
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

