const Sequelize = require('sequelize')

// Accounting Data Model
const createaccDataModel = (db) => {
  return db.define('radacct', {
    radacctid: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    acctsessionid: Sequelize.STRING,
    acctuniqueid: Sequelize.STRING,
    username: Sequelize.STRING,
    realm: Sequelize.STRING,
    nasipaddress: Sequelize.STRING,
    nasportid: Sequelize.STRING,
    nasporttype: Sequelize.STRING,
    acctstarttime: Sequelize.DATE,
    acctupdatetime: Sequelize.DATE,
    acctstoptime: Sequelize.DATE,
    acctinterval: Sequelize.INTEGER,
    acctsessiontime: Sequelize.BIGINT,
    acctauthentic: Sequelize.STRING,
    connectinfo_start: Sequelize.STRING,
    connectinfo_stop: Sequelize.STRING,
    acctinputoctets: Sequelize.BIGINT,
    acctoutputoctets: Sequelize.BIGINT,
    calledstationid: Sequelize.STRING,
    callingstationid: Sequelize.STRING,
    acctterminatecause: Sequelize.STRING,
    servicetype: Sequelize.STRING,
    framedprotocol: Sequelize.STRING,
    framedipaddress: Sequelize.STRING
  },{
    tableName: 'radacct',
    timestamps: false
  })
}

// User Model
const createUserModel = (db) => {
  return db.define('radcheck', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      username: Sequelize.STRING,
      attribute: Sequelize.STRING,
      op: Sequelize.STRING,
      value: Sequelize.STRING
  },{
    tableName: 'radcheck',
    timestamps: false
  })
}

module.exports = {
 createaccDataModel,
 createUserModel
}
