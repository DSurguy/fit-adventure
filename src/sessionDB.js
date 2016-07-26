let Sequelize = require('sequelize'),
    dbConfig = require('../config/sessionDatabase.js');

module.exports = new Sequelize(dbConfig.name, dbConfig.options);