const sequelize = require("sequelize");

const connection = new sequelize.Sequelize("perguntados", "root", "", {
    host: "localhost",
    dialect: "mysql"
});

module.exports = connection;