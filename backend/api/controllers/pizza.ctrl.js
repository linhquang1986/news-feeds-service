exports.getAuthor = (req, res, next) => {
	try {
        let sql = "SELECT author FROM articles GROUP BY author";
        let params = []
        this.db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
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
        let sql = "select * from articles where isDel=1"
        let params = []
        this.db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
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
        let sql = "select * from article where id = ?"
        let params = [req.params.id]
        this.db.get(sql, params, (err, row) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": row
            })
        });
    } catch (e) {
        next(e);
    }
}
exports.postArticles = (req, res, next) => {
    try {
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
                this.db.run(sql, params, function (err, result) {
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
}
exports.deleteAll = (req, res, next) => {
    try {
        let sql = 'UPDATE articles set isDel=0 WHERE id = ?'
        let delID =  req.params.id || 0
        this.db.run(sql, delID,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", "data": result })
            });
    } catch (e) {
		next(e);
	}
}

exports.deleteByID = (req, res, next) => {
    try {
        let sql = 'UPDATE articles set isDel=0 WHERE id = ?'
        let delID =  req.params.id || 0
        this.db.run(sql, delID,
            function (err, result) {
                if (err) {
                    res.status(400).json({ "error": res.message })
                    return;
                }
                res.json({ "message": "deleted", "data": result })
            });
    } catch (e) {
		next(e);
	}
}
exports.getNewByAuthorAndSource = (req, res, next) => {
	try {
        let sql = '';
        if (req.body.author && req.body.sourceName) {
            sql = `SELECT * FROM articles WHERE author IN('${req.body.author}') AND sourceName IN('${req.body.sourceName}')`;
        } else if (req.body.author && !req.body.sourceName) {
            sql = `SELECT * FROM articles WHERE author IN('${req.body.author}')`;
        } else {
            sql = `SELECT * FROM articles WHERE sourceName IN('${req.body.sourceName}')`;        
        }
        let params = []
        this.db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
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
        let sql = "SELECT sourceName FROM articles GROUP BY sourceName";
        let params = []
        this.db.all(sql, params, (err, rows) => {
            if (err) {
                res.status(400).json({ "error": err.message });
                return;
            }
            res.json({
                "message": "success",
                "data": rows
            })
        });
	} catch (e) {
		next(e);
	}
}