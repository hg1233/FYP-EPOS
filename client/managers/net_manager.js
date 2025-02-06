const { app, net } = require("electron/main");
const https = require('http');

class NetManager {

    server_host;
    api_key;
     
    constructor() {
        this.server_host = 'http://localhost:3000' // TODO - move to config file
        this.api_key = '123456' // TODO - move to config file
    }

    async pre_ready_request(endpoint) {
        // TODO - implement try/catch to prevent error if unable to reach server
        
        return new Promise( (resolve, reject) => {
            https.get(this.server_host + endpoint, (response) => {
                let data = '' 

                    // data returned in buffers, need to add in batches to overall output
                    response.on('data', (d) => {
                        data += d;
                    })

                    // all data received
                    response.on('end', (e) => {
                        resolve(JSON.parse(data)); // return 
                    });
                    
                });
        })
    }

    async async_get(endpoint) {
        var response = await net.fetch(this.server_host + endpoint, {
            headers: {
                'EPOS_API_KEY': this.api_key,
            },
        }
        )

        if(response.ok) {
            return await response.json()
        } else {
            return new Error('Fetch request error')
        }

    }

    async async_post(endpoint, data) {
        return new Promise( (resolve, reject) => {
            try { 

                let output = '';

                // convert to json encoded string for transport 
                data = JSON.stringify(data);

                const req = net.request({
                    method: "POST",
                    url: this.server_host + endpoint,
                    path: endpoint,
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })

                req.on('response', (res) => {

                    res.on('data', (chunk) => {
                        output += chunk;
                    })

                    res.on('end', () => {
                        resolve(JSON.parse(output));
                    })

                })

                req.on('error', (error) => {
                    throw error;
                })

                req.write(data);
                req.end();

            } catch(error) {
                console.error(`An error occurred making a POST request to endpoint ${endpoint}`);
                console.error(error);
                return null;
            }
        });
    }
    

}

const instance = new NetManager();
module.exports = {instance}