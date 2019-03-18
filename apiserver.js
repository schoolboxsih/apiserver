const express = require('express')
const axios = require("axios")
const cors = require('cors')

const firepower = require('./firepower')
const db = require('./database')

/* INITS */

// express init
const PORT = 9004
const app = express()
app.use(cors())
const start = () => {
    app.listen(PORT, () => console.log(`listening on port ${PORT}!`))
    console.log(ep)
    console.log(fpAPIClient.endpoints)
}

// firepower init
const fpAPIClient = new firepower.APIClient()
const fp = fpAPIClient.client()
let ep = {}
fpAPIClient.generatetoken().then(e => {
    ep = e.endpoints
    start()
})

// util functions
const returnJSON = (res, r) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r))
}

/* ROUTES */

// return data of all users
app.get('/users/allstudents', (req, res) => {
    db.getAllUsers()
      .then(r => {
        returnJSON(res, r)
      })
})

// refresh token
app.get('/fmc/refresh', (req, res) => {
    fpAPIClient.generatetoken().then(e => {
        ep = e.endpoints
    })
})

// get fmc info
app.get('/fmc/info', (req, res) => {
    fp.get(ep.serverversion)
      .then(e=>{
        console.log(e)
      })
      .catch(e=>{
        console.log(e)
      })
})

// get syslog info
app.get('/fmc/syslog', (req, res) => {
    fp.get(ep.syslogalerts)
      .then(e=>{
        console.log(e)
      })
      .catch(e=>{
        console.log(e)
      })
})


/**
URL:
Traffic by URL
Traffic by URL Category
Traffic by URL Reputation

Network Information:
Operating Systems
Traffic by Source IP
Traffic by Source User
Connections by Access Control Action
Traffic by Destination IP

Analysis > Users > Users

Policies
Access Control
*/
