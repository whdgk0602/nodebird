require('dotenv').config()

module.exports = {
  development : {
    username : 'root',
    password: process.env.SEQUELIZE_PASSWORD,
    database: 'nodebird',
    host: '127.0.0.1',
    port: process.env.SEQUELIZE_PORT || 3306,
    dialect: 'mysql'
  },
  test : {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "nodebird",
    host: "127.0.0.1",
    port: process.env.SEQUELIZE_PORT || 3306,
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "database_production",
    host: "127.0.0.1",
    port: process.env.SEQUELIZE_PORT || 3306,
    dialect: "mysql"
  },
}