const { app, net } = require("electron/main");
const https = require('http');

class NetManager {

    server_host;
    api_key;
    use_local_cache;
    heartbeat;
    heartbeat_interval;
    heartbeat_last_res_time;
     
    constructor() {
        this.server_host = 'http://localhost:3000' // TODO - move to config file
        this.api_key = '123456' // TODO - move to config file
        this.heartbeat_interval = 15000; // TODO - move to config file
        
        // send out heartbeat to server on defined interval
        this.heartbeat = setInterval(async () => {
            console.debug(`Sending heartbeat at ${Date.now()} ...`)
            this.check_heartbeat();
        }, this.heartbeat_interval);

    }

    async pre_ready_request(endpoint) {
        // TODO - implement try/catch to prevent error if unable to reach server
        
        return new Promise( (resolve, reject) => {
            
            // TODO - send API key here (missing)

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
                    
                }
            ).on('error', function(error) {
                reject(error);
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
    
    async check_heartbeat() {
        try {
            let response = await this.pre_ready_request("/heartbeat");

            if(response["status"] == "ok") {
                // heartbeat successful
                this.heartbeat_last_res_time = Date.now();

                // check if local caching (offline mode) on, if so disable it 
                if(this.use_local_cache) {
                    this.use_local_cache = false;
                    console.info(`Connection restored to server at ${Date.now()}, switching to online mode`)
                }

                return;
            }

            // else, heartbeat unsuccessful, trigger caching system
            if(!this.use_local_cache) {
                console.warn(`Connection still down at ${Date.now()}`)
            }
            this.use_local_cache = true;
            console.warn(`Lost connection to server at ${Date.now()}, switching to local cache mode`)
            
        } catch(err) {

            // heartbeat unsuccessful, trigger caching system
            this.use_local_cache = true;
            console.warn(`Lost connection to server at ${Date.now()}, switching to local cache mode`)
        }
    }


}

const instance = new NetManager();
module.exports = {instance}