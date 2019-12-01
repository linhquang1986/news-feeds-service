let fs = require('fs');

let type = 'cluster'
let id;

const express = require("express");
const app = express();
const cors = require('cors');
const bodyParser = require("body-parser");

const routes = require('./api/routes');

class Worker {
  constructor () {
    id = Number(process.env.id)
    process.title = 'node '+ type +' worker '+ id
    this.webserver()
    //setInterval(this.write, 5000)
  }

  write () {
    fs.writeFile(`./data/${type}-worker${id}.hit`, hit)
    fs.writeFile(`./data/${type}-worker${id}.mem`, Date.now() + ' ' + JSON.stringify(process.memoryUsage()) + '\n', (error) => {});
  }

  webserver() {
    app.use(cors({
        origin: 'http://localhost:3000',
        credentials: true
    }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
     // mount api routes
    app.use('/api', routes); 
    const HTTP_PORT = 8000
    
    // Start server
    app.listen(HTTP_PORT, () => {
        console.log('Worker', id, "listening on port %PORT%".replace("%PORT%", HTTP_PORT));
    });

   
  }
}

module.exports = Worker