var sqlite3 = require('sqlite3').verbose()
const DBSOURCE = "./db/db.sqlite" 


let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    } else{
        console.log('Connected to the SQlite database.')
        db.run(`CREATE TABLE articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author text, 
            title text, 
            description text,
            url text UNIQUE, 
            urlToImage text, 
            publishedAt text, 
            content text,
            sourceID text,
            sourceName text,
            isDel BOOLEAN
            )`,(err) => {
        if (err) {
            console.log('Table already created.')
        }
    })  
    }
})
module.exports = db