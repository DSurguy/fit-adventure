let Sequelize = require('sequelize'),
    dbConfig = require('../config/database.js');

let db = new Sequelize(dbConfig.name, dbConfig.options);

var User = db.define('user', {
  id: {
      type: Sequelize.STRING
  },
  accessToken: {
      type: Sequelize.STRING
  },
  refreshToken: {
      type: Sequelize.STRING
  },
  profile: {
      type: Sequelize.STRING
  }
});

// force: true will drop the table if it already exists
User.sync({force: true}).then(function () {});

module.exports = {
    DB: db,
    User: User
};