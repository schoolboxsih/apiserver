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
const URL = model.createURLModel(db)
const Network = model.createNetworkModel(db)
const Vlan = model.createVLANModel(db)

// fetch
const fetchAllAccInfo = () => ( AccData.findAll() )
const fetchAccInfo = (username) => ( AccData.findAll({ where: { username: username } }) )

const fetchAllUsers = () => ( User.findAll() )
const fetchUser = (username) => ( User.findOne({ where: { username: username } }) )

const fetchURLs = () => ( URL.findAll() )
const fetchURL = (uuid) => ( URL.findOne({ where: {uuid: uuid} }) )

const fetchNetworks = () => ( Network.findAll() )
const fetchNetwork = (uuid) => ( Network.findOne({ where: {uuid: uuid} }) )

const fetchVlans = () => ( Vlan.findAll() )
const fetchVlan = (uuid) => ( Vlan.findOne({ where: {uuid: uuid} }) )

// create
const createUser = (username, password) => {
  return User.create({ username: username, attribute: 'Cleartext-Password', op: ':=', value: password })
}
const createURL = (name, url, uuid) => {
  return URL.create({ name: name, url: url, uuid: uuid })
}
const createNetwork = (name, network, uuid) => {
  return Network.create({ name: name, network: network, uuid: uuid })
}
const createVlans = (name, starttag, endtag, uuid) => {
  return Vlan.create({ name: name, starttag: starttag, endtag: endtag, uuid: uuid })
}

// update
const updateUser = (user) => {
  return User.update(user, { where: { id: user.id } })
}
const updateURL = (url) => {
  return URL.update(url, { where: { id: url.id } })
}
const updateNetwork = (network) => {
  return Network.update(network, { where: { id: network.id } } )
}
const updateVlans = (vlan) => {
  return Vlan.update(vlan, { where: { id: vlan.id } })
}


// export
module.exports = {
    db,
    fetchAllAccInfo,
    fetchAccInfo,
    fetchAllUsers,
    fetchUser,
    fetchURLs,
    fetchURL,
    fetchNetworks,
    fetchNetwork,
    fetchVlans,
    fetchVlan,
    createUser,
    createURL,
    createNetwork,
    createVlans,
    updateUser,
    updateURL,
    updateNetwork,
    updateVlans,
}
