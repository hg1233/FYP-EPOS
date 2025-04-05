const fs = require('fs');
const path = require('path'); 

class FileManager {

    app;
    user_data_dir;
    config;

    constructor(app) {
        this.app = app;
        this.user_data_dir = app.getPath('userData');
        this.loadLocalConfig();
    }

    async loadLocalConfig() {

        if(await this.checkIfLocalConfigExists(this.user_data_dir) == false) {
            console.log(`Config not found in ${this.user_data_dir}, writing default config...`)
            await this.createDefaultConfig();
        }

        try {
            let config_path = path.join(this.user_data_dir, 'epos_config.json');


            let data = fs.readFileSync(config_path, "utf-8");
            this.config = JSON.parse(data);
            
            console.debug(`Imported config from '${config_path}`)
        } catch(error) {
            console.error("Error when reading local config", error)
        }
    }

    async checkIfLocalConfigExists() {
        try {
            // check file exists, and process has read & write perms
            var exists = await fs.access(path.join(this.user_data_dir, 'epos_config.json'), fs.constants.R_OK | fs.constants.W_OK, (error) => {
                if(error) {
                    return false;
                }

                // all ok, return true
                return true;

            })
            
        } catch(error) {
            console.error("Unknown error occurred checking if local config exists:", error)
            return false;
        }
    }

    async createDefaultConfig() {

        let default_data = {

            network: {
                server_host: "http://example.com",
                api_key: "123456",
                heartbeat_interval: 15000,
            },
            printing: {
                is_enabled: false,
                printing_type: "PDF",
                kitchen_printer: "",
                receipt_printer: "",
            },

        }

        writeConfig(default_data);

    }

    async writeConfig(data) {
        // null & 1 used to add whitespace for config readability, rather than it all be in 1 line
        fs.writeFile(path.join(this.user_data_dir, 'epos_config.json'), JSON.stringify(data, null, 1), (error) => {
            if(error) {
                console.error("Error writing config:");
                console.error(error);
                return;
            }
            console.log("Config written to disk succesfully.")
        })
    }

    async saveCurrentConfig() {
        this.writeConfig(this.config);
    }
}

module.exports = {FileManager};