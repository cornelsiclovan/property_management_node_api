const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Place = sequelize.define('place', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    suprafata : {
        type: Sequelize.STRING,
        allowNull: true
    },
    country: {
        type: Sequelize.STRING,
        allowNull: false
    },
    city: {
        type: Sequelize.STRING,
        allowNull: false
    },  
    street:{ 
        type: Sequelize.STRING,
        allowNull: false
    },
    number: {
        type: Sequelize.STRING,
        allowNull: true
    },
    apartment: {
        type: Sequelize.STRING,
        allowNull: true
    },
    occupied: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
});

module.exports = Place;