var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author text, 
            title text, 
            description text,
            url text, 
            urlToImage text, 
            publishedAt text, 
            content text,
            sourceID text,
            sourceName text
            )`,(err) => {
        if (err) {
            // Table already created
        } else{
            // Table just created, creating some rows
            var insert = 'INSERT INTO articles (author, title, description, url, urlToImage, publishedAt, content, sourceID, sourceName) VALUES (?,?,?,?,?,?,?,?,?)'
            db.run(insert, ["Anatol Antonovici","ss", "ss","ss", "ss", "ss","ss", "ssss","quang"])
        }
    })  
    }
})


module.exports = db

