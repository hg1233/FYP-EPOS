const { app, net, dialog } = require("electron/main");
const https = require('http');

class NetManager {

    file_manager;
    close_func;
    is_crashing;
    module_manager;
    server_host;
    api_key;
    use_local_cache;
    heartbeat;
    heartbeat_interval;
    heartbeat_last_res_time;
     
    constructor(file_manager, module_manager, close_func) {
        this.file_manager = file_manager;
        this.module_manager = module_manager;
        this.close_func = close_func;
        this.is_crashing = false;

        this.server_host = file_manager.config.network.server_host
        this.api_key = file_manager.config.network.api_key
        this.heartbeat_interval = file_manager.config.network.heartbeat_interval
        
        // send out heartbeat to server on defined interval
        this.heartbeat = setInterval(async () => {
            console.debug(`Sending heartbeat at ${Date.now()} ...`)
            this.check_heartbeat();
        }, this.heartbeat_interval);

    }

    async async_get(endpoint) {

        let promise = new Promise( (resolve, reject) => {
            
            let request_options = {
                headers: {
                    'EPOS_API_KEY': this.api_key,
                }
            }

            let request = https.get(this.server_host + endpoint, request_options, (response) => {
                let data = '' 

                    // data returned in buffers, need to add in batches to overall output
                    response.on('data', (d) => {
                        data += d;
                    })

                    // all data received
                    response.on('end', (e) => {
                        try {
                            let output = JSON.parse(data);
                            resolve(output);
                        } catch(error) {
                            reject(error);
                        }
                    });
                    
                }
            );
            
            request.on('error', function(error) {
                reject(error);
            });

        })

        promise.catch((error) => {
            console.error("Error making network request: ")
            console.error(error);
            // this means there is a network or server error that isnt handled using json
            // exit app to be safe

            // prevent spam of err msgs
            if(this.is_crashing) return;

            // process err code
            let message = "Unfortunately, a critical network error has occurred and the EPOS system cannot continue running. Please verify your network settings and try again.";

            if(error.code = "ENOTFOUND") message = "The server host defined in the configuration cannot be found. Please confirm your settings and try again.";

            // add exit warning
            message = message + " This application will now exit."

            dialog.showErrorBox("Network Error",message)
            this.close_func();
            this.is_crashing = true;
        })

        return promise;
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
                        'EPOS_API_KEY': this.api_key,
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
            let response = await this.async_get("/heartbeat");

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

module.exports = {NetManager};