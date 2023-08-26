// //////////// To connect the MySQL DB to Node App
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//     host: 'localhost',
//     user: 'root',
//     database: 'node_project',
//     password: '*********'
// });

// module.exports = pool.promise();

// ////////// Making connection using Sequelize
const Sequelize = require("sequelize");

const sequelize = new Sequelize("node_project", "root", "**********", {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;
