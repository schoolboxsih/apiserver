const express = require('express')
const bodyParser = require('body-parser')
const axios = require("axios")
const cors = require('cors')

const r = require('./routes.js')

const PORT = 9004
const app = express()
const jp = bodyParser.json()
app.use(cors())
r.start(app, PORT)

// database
app.get('/users/allstudents', r.getallstudents) // data of all users

// firepower
app.get('/fmc/refresh', r.refreshtoken) // refresh token
app.get('/fmc/objects/urls', r.fetchUrls) // fmc url objects
app.post('/fmc/objects/urls', jp, r.createUrl) // fmc url objects
app.get('/fmc/accesspolicies', r.fetchAccessPolicies) // fmc access policies
app.get('/fmc/accessrules', r.fetchAccessRules) // fmc access policy rules
app.get('/fmc/firewallinfo', r.getfmcinfo) // firewall info
app.get('/fmc/syslogalerts', r.getfmcsyslog) // syslog alerts
