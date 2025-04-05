class FileManager {

    user_data_dir;
    config;

    constructor() {
        this.user_data_dir = app.getPath('userData');
        loadLocalConfig();
    }

    async loadLocalConfig(user_data_dir) {

        if(await this.checkIfLocalConfigExists(user_data_dir) == false) {
            // TODO create local config
        }

        try {
            var data = await fs.readFile(path.join(user_data_dir, 'epos_config.json'));
            var json = JSON.parse(data);
            console.debug(user_data_dir)

            // TODO import server_host & api key
        } catch(error) {
            console.error("Error when reading local config", error)
        }
    }

    async checkIfLocalConfigExists(user_data_dir) {
        try {
            var exists = await fs.access(path.join(user_data_dir, 'epos_config.json'))
            return true;
        } catch(error) {
            return false;
        }
    }
}

// TODO