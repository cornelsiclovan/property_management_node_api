const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Client = sequelize.define('client', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    userId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    placeId: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    confirm: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

module.exports = Client;