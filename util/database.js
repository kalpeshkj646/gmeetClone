// //////////// To connect the MySQL DB to Node App
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_project',
//     password: 'Kj@mysql#646'
// });

// module.exports = pool.promise();

// ////////// Making connection using Sequelize
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_project", "root", "Kj@mysql#646", {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
