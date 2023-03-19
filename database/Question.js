const sequelize = require("sequelize");
const connection = require("./connection");

const Question = connection.define("question", {
    title: {
        type: sequelize.STRING,
        allowNull: false
    },
    description: {
        type: sequelize.TEXT,
        allowNull: false
    }
});

Question.sync({ force: false });

module.exports = Question;