const axios = require("axios")
const baseURL = "https://fmcrestapisandbox.cisco.com/api/"

const generatetoken = () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
    const genURL = "fmc_platform/v1/auth/generatetoken"
    const authinfo = {
        username: 'hrishikesh',
        password: 'pYxuKwvz'
    }
    axios.post(`${baseURL}${genURL}`,{auth: authinfo})
        .then((r)=>{
            console.log(r)
        })
        .catch((e)=>{
            console.log(e)
        })
    return
}

module.exports = {
    generatetoken
}