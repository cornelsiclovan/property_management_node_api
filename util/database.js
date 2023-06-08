const Sequelize = require('sequelize');

const sequelize = new Sequelize("gestiune_proprietati", "root", "", {
    dialect: "mysql",
    host: "localhost"
});

module.exports = sequelize;