const express = require('express')
const axios = require("axios")
const cors = require('cors')

const r = require('./routes.js')

const PORT = 9004
const app = express()
app.use(cors())
r.start(app, PORT)

// return data of all users
app.get('/users/allstudents', r.getallstudents)

// refresh token
app.get('/fmc/refresh', r.refreshtoken)

// get fmc info
app.get('/fmc/info', r.getfmcinfo)

// get syslog info
app.get('/fmc/syslog', r.getfmcsyslog)
