var express = require("express")
var app = express()
var db = require("./database.js")
var fetch = require('node-fetch')

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var HTTP_PORT = 8000

// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%", HTTP_PORT))
});

//get data from pizza
IfoundData = (newSource) => {
    return fetch(`http://www.mocky.io/v2/${newSource}`, {
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

app.post("/api/articles/", (req, res, next) => {
    let newSource = "5dc01bc8310000b288be3e37";
    if (req.body.newSource) {
        newSource = req.body.newSource;
    }
    let pizzaSource = async () => {
        let data = await IfoundData(newSource);
        return data;
    }
    pizzaSource().then(data => {
        data.map(item => {
            var sql = 'INSERT INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName) VALUES (?,?,?,?,?,?,?,?,?)'
            var params = [item.author, item.title, item.description, item.url, item.urlToImage, item.publishedAt, item.content, item.sourceID, item.sourceName]
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


app.delete("/api/article/:id", (req, res, next) => {
    db.run(
        'DELETE FROM article WHERE id = ?',
        req.params.id,
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

