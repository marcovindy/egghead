const mysql = require('mysql')
const db = mysql.createConnection({
host: "us-cdbr-east-06.cleardb.net",
user: "b88095e6f76c5d",
password: "b95f0a62",
database:"heroku_6c2d5eee42a52cf" 
})

module.exports = db;