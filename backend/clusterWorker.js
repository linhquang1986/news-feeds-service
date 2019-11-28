let fs = require('fs')
let http = require('http')
let type = 'cluster'
let id;

const express = require("express")
const app = express()
const db = require("./database.js")
const fetch = require('node-fetch')
const cors = require('cors');
const bodyParser = require("body-parser");

class Worker {
  constructor () {
    id = Number(process.env.id)
    process.title = 'node '+ type +' worker '+ id
    this.webserver()
    setInterval(this.write, 5000)
  }

  write () {
    // fs.writeFile('./data/'+ type +'-worker'+ id +'.hit', hit)
    // fs.writeFile('./data/'+ type +'-worker'+ id +'.mem', Date.now()
    //   +' '+ JSON.stringify(process.memoryUsage())
    //   +'\n', { flag: 'a' })
  }

  webserver () {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    
    const HTTP_PORT = 8000
    
    // Start server
    app.listen(HTTP_PORT, () => {
        console.log('Worker', id, "listening on port %PORT%".replace("%PORT%", HTTP_PORT));
    });
    
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
    
    // Get list author
    app.get("/api/getAuthor", (req, res, next) => {
        let sql = "SELECT author FROM articles GROUP BY author";
        let params = []
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
    
    // Get list name of source
    app.get("/api/getSource", (req, res, next) => {
        let sql = "SELECT sourceName FROM articles GROUP BY sourceName";
        let params = []
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
    app.post("/api/getNewByAuthorAndSource", (req, res, next) => {
        let sql = '';
        if (req.body.author && req.body.sourceName) {
            sql = `SELECT * FROM articles WHERE author IN('${req.body.author}') AND sourceName IN('${req.body.sourceName}')`;
        } else if (req.body.author && !req.body.sourceName) {
            sql = `SELECT * FROM articles WHERE author IN('${req.body.author}')`;
        } else {
            sql = `SELECT * FROM articles WHERE sourceName IN('${req.body.sourceName}')`;        
        }
        let params = []
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
        let sql = "select * from articles where isDel=1"
        let params = []
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
        let sql = "select * from article where id = ?"
        let params = [req.params.id]
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
            console.log(id +'dang thuc hien la' + newSource)
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
    })
    
    // Delete all data
    app.delete("/api/articles/", (req, res, next) => {
        let sql = 'DELETE FROM articles'
        let params = []
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
        let sql = 'UPDATE articles set isDel=0 WHERE id = ?'
        let delID =  req.params.id || 0
        db.run(sql, delID,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", "data": result })
            });
    })
    
    // Root path
    app.get("/", (req, res, next) => {
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
    
    
  }
}

module.exports = Worker