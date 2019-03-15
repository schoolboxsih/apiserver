const express = require('express')
const axios = require("axios")
const cors = require('cors')
const Sequelize = require('sequelize')

const app = express()
app.use(cors())

const port = 9004

// Firepower
const axiosinstance = axios.create({
  baseURL: '/api/fmc_config/v1/domain/e276abec-e0f2-11e3-8169-6d9ed49b625f/',
  timeout: 1000,
  headers: {
  	"X-auth-access-token": "5c90cf8b-ef8a-4588-9aa6-7e2b844440e1",
  	"X-auth-refresh-token": "ca313516-fbab-4faf-bec2-19fb86a11833"
  }
})

const requiredEndpoints = {
	syslogalerts : "policy/syslogalerts",
	auditrecords : "audit/auditrecords",
	deployabledevice : "deployment/deployabledevices",
	ftddevicehapairs : "devicehapairs/ftddevicehapairs",
	externallookups : "integration/externallookups",
	extentedaccesslist : "object/extendedaccesslist",
	networkaddress : "object/networkaddresses",
	accesspolicies : "policy/accesspolicies"
}

// Connect to mysql
const sequelize = new Sequelize('students', 'geekodour', '123', {
  dialect: 'mysql'
});

// insert into radcheck (username,attribute,op,value) values("plastic", "Cleartext-Password", ":=", "123")

// API Endpoints for FMC
app.get('/policy/alerts', (req, res) => {
    axiosinstance.get(requiredEndpoints.syslogalerts)
        .then(r=>{
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(r));
        })
        .catch(e=>{
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({"error":"400"}));
        })
})

// API Endpoints for RADIUS Data
app.get('/data/allstudents', (req, res) => {
    sequelize.query("SELECT * FROM radcheck").then(myTableRows => {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(myTableRows[0]));
    })
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
