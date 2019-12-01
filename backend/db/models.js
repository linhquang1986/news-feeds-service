var Sequelize = require('sequelize');
let path = require('path');
const sequelize = new Sequelize('db', 'username', 'password', {
    // sqlite! now!
    dialect: 'sqlite',
    // the storage engine for sqlite
    // - default ':memory:'
    storage: path.join(`${__dirname}/db.sqlite`)
  })
var Article = sequelize.define('articles', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    author: Sequelize.STRING,
    title: Sequelize.STRING,
    description: Sequelize.TEXT,
    url:Sequelize.STRING,
    urlToImage: Sequelize.STRING,
    publishedAt: Sequelize.STRING,
    content: Sequelize.STRING,
    sourceID: Sequelize.STRING,
    sourceName: Sequelize.STRING,
    isDel:Sequelize.INTEGER
}, {
    timestamps: false
});

module.exports = Article;
