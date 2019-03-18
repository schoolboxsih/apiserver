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
        console.log(e)
      })
}

const getfmcinfo = (req, res) => {
    fp.get(ep.serverversion)
      .then(e=>{
        returnJSON(res, e.data)
      })
      .catch(e=>{
        console.log(e)
      })
}

const getallstudents = (req, res) => {
    db.getAllUsers()
      .then(r => {
        returnJSON(res, r)
      })
      .catch(e=>{
        console.log(e)
      })
}

const refreshtoken = (req, res) => {
    fpAPIClient.generatetoken().then(e => {
        ep = e.endpoints
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
}
