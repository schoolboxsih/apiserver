const firepower = require('./firepower')
const db = require('./database')

// firepower init
const fpAPIClient = new firepower.APIClient()
const fp = fpAPIClient.client()
let ep = {}

// util functions
const returnJSON = (res, r) => {
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(r))
}
const start = ( app, port ) => {
    fpAPIClient.generatetoken()
    .then(e => {
        ep = e.endpoints
        app.listen(port, () => console.log(`listening on port ${port}!`))
    })
}

// functions
const getfmcsyslog = (req, res) => {
    fp.get(ep.syslogalerts)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            returnJSON(res, {error: 'unable to reach api endpoint'})
        }
      })
}

const getfmcinfo = (req, res) => {
    fp.get(ep.serverversion)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        }
      })
}

const getallstudents = (req, res) => {
    db.getAllUsers()
      .then(r => {
        returnJSON(res, r)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        }
      })
}

const refreshtoken = (req, res) => {
    fpAPIClient.generatetoken().then(e => {
        ep = e.endpoints
    })
}

const createUrls = (req, res) => {
    if( !(req.body.name && req.body.url) ) {
        res.status(400)
        returnJSON(res, {error: 'required body params not found'})
    }
    let data = {
        name: req.body.name,
        url: req.body.url
    }
    fp.post(ep.urlobjects, data)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        } else {
            res.status(400)
            returnJSON(res, { error: e.response.data.error })
        }
      })
}

const fetchUrls = (req, res) => {
    fp.get(ep.urlobjects)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        }
      })
}

const fetchAccessPolicies = (req, res) => {
    fp.get(ep.accesspolicyobjects)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        }
      })
}

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


--
Create URL Objects
"/api/fmc_config/v1/domain/e276abec-e0f2-11e3-8169-6d9ed49b625f/object/urls"

Create Rules
api_path = "/api/fmc_config/v1/domain/e276abec-e0f2-11e3-8169-6d9ed49b625f/policy/accesspolicies/{}/accessrules".format(container_id)    # param

Create Policy
api_path = "/api/fmc_config/v1/domain/e276abec-e0f2-11e3-8169-6d9ed49b625f/policy/accesspolicies"    # param

Fetch Policy
api_path = "/api/fmc_config/v1/domain/e276abec-e0f2-11e3-8169-6d9ed49b625f/policy/accesspolicies/{}".format(idx)    # param

---

Objects:
- VLAN Tags
    - Students
    - Teachers
    - Unknown
- Add Networks
    - each classrooms will be one network
- Ports
- Applications ??
- URL
    - Create URL groups of it
- Time range
- ACL ( to block networks ) - extended to block some internal network from accessing outside network

Policies: 
- Access Control
- DNS

*/

module.exports = {
  start,
  getfmcsyslog,
  getallstudents,
  refreshtoken,
  getfmcinfo,
  fetchUrls,
  createUrls,
  fetchAccessPolicies,
}
