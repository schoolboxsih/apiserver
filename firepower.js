const axios = require("axios")

// DON'T VERIFY TLS
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'

class APIClient {
  constructor() {
    this.tokengen = axios.create({
      baseURL: 'https://fmcrestapisandbox.cisco.com/api/',
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      },
      auth: {
          username: 'hrishikesh',
          password: 'pYxuKwvz'
      }
    })

    this.apiclient = axios.create({
      baseURL: 'https://fmcrestapisandbox.cisco.com/api/',
      headers: {}
    })
    
    this.globalid = ''
    this.endpoints = {}
  }

  client(){
    return this.apiclient
  }

  refreshEndpoints(){
    return {
  	    syslogalerts : `fmc_config/v1/domain/${this.globalid}/policy/syslogalerts`,
  	    serverversion : "fmc_platform/v1/info/serverversion",
    } 
  }

  generatetoken() {
      return this.tokengen.post('fmc_platform/v1/auth/generatetoken')
          .then((r)=>{

              this.globalid = r.headers['global']
              this.endpoints = this.refreshEndpoints()

              let juice = {
                'x-auth-access-token': r.headers['x-auth-access-token'],
                'x-auth-refresh-token': r.headers['x-auth-refresh-token'],
                'global': r.headers['global'],
                'endpoints': this.endpoints
              }

              this.apiclient.defaults.headers.common['x-auth-access-token'] = juice['x-auth-access-token']
              this.apiclient.defaults.headers.common['x-auth-refresh-token'] = juice['x-auth-refresh-token']

              return juice
          })
          .catch((e)=>{
              console.log("Problem connecting to FMC API")
          })
  }
}

module.exports = {
    APIClient
}
