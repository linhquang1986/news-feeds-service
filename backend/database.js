"use strict";

//const env = process.env.NODE_ENV || "development";
//const config = require(path.join(__dirname, './', 'config', 'config.json'))[env];

const sqlite3 = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: ':memory:'
      },
    useNullAsDefault: true
  });

  const bookshelf = require('bookshelf')(sqlite3)

  // Defining models
  const User = bookshelf.model('User', {
    tableName: 'users'
  })

// var Sequelize = require('sequelize'),
// 	sequelize = new Sequelize('aes_db', null, null, {
// 		host: 'localhost',
// 		dialect: 'sqlite',
// 		pool: {
// 			max: 5,
// 			min: 0,
// 			idle: 10000
// 		},
// 		storage: './data.sqlite'
// 	});

// exports.config = {
// 	db: sequelize 
// };

// var sequelize = new Sequelize(config.database, 'username', 'password', {
//     host: config.host,
//     dialect:config.dialect,
//     pool: {
//         max: 5,
//         min: 0,
//         idle: 10000
//     },
//    storage: path.join(__dirname, './', 'db', 'pizza.sqlite')
// });

// var db = {};

// sequelize.define('Project', {
//     title: Sequelize.STRING,
//     description: Sequelize.TEXT
// })

// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// // let db = new sqlite3.Database(DBSOURCE, (err) => {
// //     if (err) {
// //         // Cannot open database
// //         console.error(err.message)
// //         throw err
// //     } else {
// //         console.log('Connected to the SQlite database.')
// //         db.run(`CREATE TABLE articles (
// //             id INTEGER PRIMARY KEY AUTOINCREMENT,
// //             author text, 
// //             title text, 
// //             description text,
// //             url text UNIQUE, 
// //             urlToImage text, 
// //             publishedAt text, 
// //             content text,
// //             sourceID text,
// //             sourceName text,
// //             isDel BOOLEAN
// //             )`, (err) => {
// //                 if (err) {
// //                     console.log('Table already created.')
// //                 }
// //             })
// //     }
// // })
// module.exports = db

