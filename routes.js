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
        db.fetchURLs().then(u => {
          console.log(u)
          //fp.get(ep.urlobjects).then(e=>{ }).catch(e=>{ })
        })
        db.fetchNetworks().then(u => { console.log(u) })
        db.fetchVlans().then(u => { console.log(u) })

        app.listen(port, () => console.log(`listening on port ${port}!`))
    })
}
const fetchUrl = (id) => {
    return fp.get(`${ep.urlobjects}/${id}`)
}

const fetchNet = (id) => {
    return fp.get(`${ep.netobjects}/${id}`)
}

const fetchVlan = (id) => {
    return fp.get(`${ep.vlanbjects}/${id}`)
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

const createNetwork = (req, res) => {
    if( !(req.body.name && req.body.network) ) {
        res.status(400)
        returnJSON(res, {error: 'required body params not found'})
    }
    let data = {
        name: req.body.name,
        value: req.body.network
    }
    //let dbEntryExists = db.query_if_network_name_exists // entry/undefined

    fp.post(ep.netobjects, data)
      .then(e=>{
        // write to urls table locally, we'll need the name and the id that's all
        // STEPS:
        // if dbEntryExists is defined
        //  just add the uuid
        // else
        //  add new db entry with the uuid and all
        returnJSON(res, e.data)
      })
      .catch(e=>{
        if( e.code == 'EHOSTUNREACH' ){
            res.status(0)
            returnJSON(res, {error: 'unable to reach api endpoint'})
        } else {
            res.status(400)
            returnJSON(res, { error: e.response.data.error })
            // if error is that fmc already has something with this name,
            // fetch the uuid of that name and put it in the db entry based on dbEntryExists
        }
      })
}

const createVlan = (req, res) => {
    if( !(req.body.name && req.body.data) ) {
        res.status(400)
        returnJSON(res, {error: 'required body params not found'})
    }
    let data = {
        name: req.body.name,
        data: req.body.data,
    }
    // "data": {
    //    "startTag": 888,
    //    "endTag": 999,
    //    "type": "VlanTagLiteral"
    // }
    fp.post(ep.vlanobjects, data)
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

const createUrl = (req, res) => {
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
        // write to urls table locally, we'll need the name and the id that's all
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


const fetchAccessRules = (req, res) => {
    if( !req.query.id ) {
        res.status(400)
        returnJSON(res, {error: 'required query params not found'})
    }
    let id = req.query.id
    ep = fpAPIClient.refreshEndpoints(id)
    fp.get(ep.accessrules)
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

const createAccessRule = (req, res) => {
    const bodyparams = ['name','action','enabled','urlIDs','sNetIDs','dNetIDs','vlanIDs']
    const actionstring = ['ALLOW', 'BLOCK'] // just not using anything else now

    // validation
    if( !req.query.id ) {
        res.status(400)
        returnJSON(res, {error: 'required query params not found'})
    }
    if ( bodyparams.map(p=>res.body[p]).includes(undefined) ) {
        res.status(400)
        returnJSON(res, {error: 'required body params not found'})
    }
    if ( !actionstring.includes(res.body.action) ) {
        res.status(400)
        returnJSON(res, {error: 'action must be one of ALLOW or BLOCK for now'})
    }

    let id = req.query.id
    let urls = req.body.urlIDs.map(x=>fetchUrl(x))
    let sNets = req.body.sNetIDs.map(x=>fetchNet(x))
    let dNets = req.body.dNetIDs.map(x=>fetchNet(x))
    let vlans = req.body.vlanIDs.map(x=>fetchVlan(x))

    let allPs = Promise.all(urls.concat(sNets, dNets, vlans))
    allPs.then(d => {
        urls = d.splice(0, urls.length)
        sNets = d.splice(0, sNets.length)
        dNets = d.splice(0, dNets.length)
        vlans = d.splice(0, vlans.length)
    })
    .catch(e=> {
        res.status(500)
        returnJSON(res, { error: 'Could not connect to FMC API server' })
    })

    let data = {
        enabled: true,
        sendEventsToFMC: true,
        urls: [],
        action: res.body.action,
        sourceNetworks: [],
        destinationNetworks: [],
        vlanTags: [],
        enableSyslog: true,
    }

    ep = fpAPIClient.refreshEndpoints(id)
    fp.post(ep.accessrules, data)
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

const fetchAccessPolicies = (req, res) => {
    fp.get(ep.accesspolicies)
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

module.exports = {
  start,
  getfmcsyslog,
  getallstudents,
  refreshtoken,
  getfmcinfo,
  fetchUrls,
  createUrl,
  fetchAccessRules,
  fetchAccessPolicies,
}
