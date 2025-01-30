class ClerksModule {

    net_manager;
    current_clerk;
    cached_clerk_data;

    constructor() {
        this.current_clerk = null;
        this.net_manager = null;
        this.cached_clerk_data = {};
    }

    init() {
        this.cacheClerks();
    }

    async cacheClerks() {
        var clerks = await this.net_manager.pre_ready_request('/api/clerks/get/all');
        // TODO - convert api data into local array (organised by PIN # maybe?)
    }

}

const instance = new ClerksModule();
module.exports = {instance};