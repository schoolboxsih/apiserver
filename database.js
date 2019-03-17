const Sequelize = require('sequelize')
const model  = require('./models.js')


const MYSQL_USER = 'root' // set from env later
const MYSQL_PASSWORD = 'password' // set from env later
const MYSQL_DATABASE = 'radius'
const MYSQL_HOST = '172.17.0.2' // set from environment later

const db = new Sequelize(MYSQL_DATABASE, MYSQL_USER, MYSQL_PASSWORD, {
  dialect: 'mysql',
  host: MYSQL_HOST,
  //logging: true,
})

// models
const AccData = model.createaccDataModel(db)
const User = model.createUserModel(db)

const getAllAccInfo = () => {
  return AccData.findAll()
}

const getAllUsers = () => {
  return User.findAll()
}

const createUser = (username, password) => {
  return User.create({ username: username, attribute: 'Cleartext-Password', op: ':=', value: password })
}

module.exports = {
    db,
    getAllAccInfo,
    getAllUsers,
    createUser
}
