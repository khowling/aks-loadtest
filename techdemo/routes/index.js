var express = require('express')
const prom = require('prom-client')
var router = express.Router()

const http = require ('http'),
      https = require ('https')


module.exports = function({agent_http, agent_https, dependency_duration}) {


    
    async function fetch(customAgent, method, url, headers = {}, body) {

        const http_s = url.startsWith('https://') ? https : http
    
        return new Promise(function(resolve, reject) {
            const options = { method, "headers": {...headers, 'Content-type': 'application/json'}, agent: customAgent? (url.startsWith('https://') ? agent_https : agent_http) : undefined }
            if (process.env.DEPENDENCY_TIMEOUT) { options.timeout = parseInt(process.env.DEPENDENCY_TIMEOUT) }
            
            const startAt = Date.now()
    
            const req = http_s.request(url, options, (res) => {
                const   { statusCode, statusMessage } = res,
                        contentType = res.headers['content-type']
                        
                res.setEncoding('utf8')
                let rawData = '';
                res.on('data', (chunk) => { rawData += chunk; })
    
                res.on('end', () => {
    
                dependency_duration.observe({url, statusCode, customAgent }, (Date.now() - startAt) / 1000);
    
                if (statusCode > 299 ) {
                    return reject(new Error(`API Call [${url}] failed status : ${statusCode} ${statusMessage} ${rawData}`))
                } else if (!/^application\/json/.test(contentType)) {
                    return resolve(rawData)
                } else {
                    try {
                        const parsedData = JSON.parse(rawData)
                        return resolve (parsedData)
                    } catch (e) {
                        return reject(new Error(`API Call [${url}] caught parse error : ${e.message}`))
                    }
                }
                });
                }).on('error', (e) => {  
                    return reject(new Error(`API Call [${url}] failed onerror : ${e.code} : ${e.message} : ${e.stack}`))  
                })
    
            if (method === 'POST' || method === 'PUT') {
                req.write(body)
            }
            req.end()
        })
    }

  

    router.get('/', async function(req, res) {
        res.render('index', { title: 'no dependencies' })
    })

    async function call_dependencies(customAgent, req, res, next) {
        try {
            const beforecalls = Date.now()
            let dep_res = ""
            if (process.env.DEPENDENCY_URL_01) {
                dep_res += `   FIRST CALL : ${JSON.stringify(await fetch(customAgent, 'POST', process.env.DEPENDENCY_URL_01, null, '{"body": "test"}'))}`
            }
            if (process.env.DEPENDENCY_URL_02) {
                dep_res += `   SECOND CALL : ${JSON.stringify(await fetch(customAgent, 'POST', process.env.DEPENDENCY_URL_02, null, '{"body": "test"}'))}`
            }
            return res.render('index', { title: `Dependency time: ${Date.now() - beforecalls}mS.    RESPONSE:  ${JSON.stringify(dep_res)}` })
        } catch (e) {
            console.error(`returning error from call_dependencies ${e}`)
            return next(e)
        }
    }

    router.get('/defaultglobalagent', async function(req, res, next) {
        call_dependencies(false, req, res, next)
    })


    router.get('/customagent', async function(req, res, next) {
        call_dependencies(true, req, res, next)
    })

    return router
}
