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
        // TODO
    }

    

}

const instance = new NetManager();
module.exports = {instance}